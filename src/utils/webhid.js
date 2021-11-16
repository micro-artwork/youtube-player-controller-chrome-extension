let filters = null;
let isInitalized = false;

const initialize = (
  filter = { vendorId: 0x04d8, productId: 0x0055 },
  onConnected = () => {},
  onDisconnceted = () => {},
) => {
  if ('hid' in navigator) {
    filters = [filter];

    // not working?
    navigator.hid.addEventListener('connect', ({ device }) => {
      console.log(`HID connected: ${device.productName}`);
      onConnected(device);
    });

    navigator.hid.addEventListener('disconnect', ({ device }) => {
      console.log(`HID disconnected: ${device.productName}`);
      onDisconnceted(device);
    });

    isInitalized = true;
    console.log('WebHID is initialized');
    return true;
  }

  return false;
};

const getDevice = async () => {
  if (isInitalized) {
    try {
      if ('hid' in navigator) {
        const devices = await navigator.hid.requestDevice({ filters });
        if (devices.length > 0) {
          return devices[0];
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    throw new Error('Hid util is not initialized');
  }
};

const WebHID = {
  initialize,
  getDevice,
};

export default WebHID;
