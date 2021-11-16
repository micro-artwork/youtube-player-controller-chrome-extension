<style>
</style>

<script>
import { onMount } from 'svelte';
import { isConnected, hidDevice } from './stores';
import debounce from 'lodash.debounce';
import WebHID from '../utils/webhid';
import { KeyboardEvents, toggleFullScreen } from '../utils/keyevents';
import ConnectButton from './ConnectButton.svelte';

let infoEl;
let videoEl;
let playerObserver;

const DeviceFilter = {
  vendorId: 0x04d8, // microchip
  productId: 0x0055, // keyboard demo
};

const REPORT_RESPONSE = {
  reportId: 0x01,
  connected: new Uint8Array([0x01]),
  disconnected: new Uint8Array([0x02]),
};

/////////////////////////////////////////////////////////////////////////////////
// lifecycle

onMount(() => {
  if ('hid' in navigator) {
    console.log('The WebHID API is supported');
    WebHID.initialize(DeviceFilter, handleConnection, handleDisconnection);

    const intervalId = setInterval(() => {
      videoEl = document.querySelector('video');
      infoEl = document.querySelector('#info.ytd-video-primary-info-renderer');

      console.log(videoEl, infoEl);

      if (videoEl && infoEl) {
        // videoEl = videoElements[0];
        clearInterval(intervalId);
        injectConnectButton(infoEl);
        observePlayer(videoEl);
      }
    }, 300);
  }
});

/////////////////////////////////////////////////////////////////////////////////
// methods and callbacks

const hasChapters = () => (document.getElementsByClassName('ytp-chapter-hover-container') || []).length > 1;

const handleInputReport = (e) => {
  const data = new Uint8Array(e.data.buffer);
  const [value] = data;
  console.log(`HID: ${e.reportId} - ${value}`);
  if (e.reportId === 0x01) {
    // const isFuncPressed = value;
    let temp;
    switch (value) {
      case 0x01:
        if (hasChapters()) {
          document.dispatchEvent(KeyboardEvents.nextChapter);
        } else {
          document.dispatchEvent(KeyboardEvents.next);
        }
        break;

      case 0x02:
        if (hasChapters()) {
          document.dispatchEvent(KeyboardEvents.prevChapter);
        } else {
          document.dispatchEvent(KeyboardEvents.prev);
        }
        break;

      case 0x04:
        document.dispatchEvent(KeyboardEvents.playPause);
        break;

      case 0x08:
        document.dispatchEvent(KeyboardEvents.mute);
        break;

      case 0x10:
        // not working by key dispatching
        // document.dispatchEvent(KeyboardEvents.volUp);

        // volume indicator on player won't be updated.
        temp = videoEl.volume + 0.05;
        videoEl.volume = temp > 1 ? 1.0 : temp;
        break;

      case 0x20:
        // not working by key dispatching
        // document.dispatchEvent(KeyboardEvents.volDown);

        // volume indicator on player won't be updated.
        temp = videoEl.volume - 0.05;
        videoEl.volume = temp < 0 ? 0 : temp;
        break;

      case 0x81:
        // to avoid below error, the device have to send Consumer Controller code(volume down and volume down), before full screen command sending
        // ERROR: Failed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
        toggleFullScreen();
        break;

      case 0x82:
        document.dispatchEvent(KeyboardEvents.mini);
        break;

      case 0x84:
        document.dispatchEvent(KeyboardEvents.theater);
        break;

      case 0x90: // seek forward
        document.dispatchEvent(KeyboardEvents.forward);
        break;

      case 0xa0: // seek backward
        document.dispatchEvent(KeyboardEvents.backward);
        break;

      default:
        // do nothing
        break;
    }
  }
};

const handleConnection = (device) => {
  console.log(`Connceted: ${device.productName}`);
};

const handleDisconnection = async (device) => {
  console.log(`Disconnceted: ${device.productName}`);
  if (device.vendorId === DeviceFilter.vendorId && device.productId === DeviceFilter.productId) {
    await device.close();
    $isConnected = false;
  }
};

const onButtonClicked = async () => {
  if ($isConnected) {
    await $hidDevice.sendReport(REPORT_RESPONSE.reportId, REPORT_RESPONSE.disconnected);
    await $hidDevice.close();
    $isConnected = false;
  } else {
    $hidDevice = await WebHID.getDevice();
    await $hidDevice.open();
    $isConnected = !!$hidDevice;
  }
};

const injectConnectButton = (target) => {
  new ConnectButton({
    target,
    props: {
      onButtonClicked,
    },
  });
};

/////////////////////////////////////////////////////////////////////////////////
// observables
isConnected.subscribe(async (value) => {
  console.log(`connected: ${value}`);
  if ($hidDevice && value) {
    $hidDevice.addEventListener('inputreport', handleInputReport);

    // send connected
    await $hidDevice.sendReport(REPORT_RESPONSE.reportId, REPORT_RESPONSE.connected);
  }
});

const observePlayer = (targetNode) => {
  playerObserver = new MutationObserver(
    debounce(() => {
      const button = document.getElementById('hid-button');
      if (!button) {
        injectConnectButton(infoEl);
      }
    }, 300),
  );
  playerObserver.observe(targetNode, {
    attributes: true,
    // childList: true,
    // characterData: true,
  });
};
</script>
