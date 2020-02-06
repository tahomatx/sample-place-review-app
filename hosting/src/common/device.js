import React from "react";
import localforage from 'localforage';
import Fingerprint2 from 'fingerprintjs2';
import nanoid from 'nanoid';


//
// デバイスIDを取得 デバイスIDはブラウザに保存される
// ログインしていないユーザーの特定(デバイスレベル)など
//
export const getDeviceId = async () => {
  let deviceId = await localforage.getItem('deviceId');

  if (!deviceId) {
    deviceId = nanoid();
    localforage.setItem('deviceId', deviceId);
  }

  return deviceId;
};

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setDeviceId(await getDeviceId());
    })();
  }, []);

  return deviceId;
};


//
// デバイスフィンガープリントの取得
//
export const getDeviceFingerprint = async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 100));
  return Fingerprint2.x64hash128((await Fingerprint2.getPromise()).map(i => i.value).join(''), 31);
};


export default {
  getDeviceId,
  getDeviceFingerprint,
};
