import {firebase} from './index';
import uuid from 'uuid';
import {FUNCTION_PATH} from '../variables/functions';

export default async (uri, name = uuid()) => {
  console.log('uri: ',uri);
  const body = new FormData();
  body.append("picture", {
    uri: uri,
    name,
    type: "image/jpg"
  });
  //console.log('body: ',body);
  // Need to change url to my URL

  console.log('FUNCTION_PATH: ',FUNCTION_PATH);
  console.log('Body: ',body);

    const res = await fetch(`${FUNCTION_PATH}/api`, {
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    });
    console.log('res: ',res);
    console.log('name: ',name);
    const url = await firebase.storage().ref(name).getDownloadURL();
    return url;
}