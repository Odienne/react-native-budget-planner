import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

/**
 * Fetches a blob from the provided URI.
 * @param {string} uri - The URI to fetch the blob from.
 * @returns {Promise<Blob>} - A promise that resolves to the fetched blob.
 */
const getBlobFromUri = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);

    setTimeout(() => {
      xhr.abort();
      reject(new Error("Request timed out"));
    }, 5000); // Timeout set to 5 seconds
  });

  return blob;
};

/**
 * Uploads a file to the storage.
 *
 * @param {Object} file - The file object to be uploaded.
 * @param {string} file.uri - The URI of the file.
 * @param {string} file.mimeType - The MIME type of the file.
 * @param {string} file.fileName - The name of the file.
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded file.
 */
const upload = async (file) => {
  const imageBlob = await getBlobFromUri(file.uri);
  const storage = getStorage();

  /** @type {any} */
  const metadata = {
    contentType: file.mimeType,
  };

  const timestamp = new Date();
  const storageRef = ref(storage, `images/${timestamp}` + file.fileName);
  const uploadTask = uploadBytesResumable(storageRef, imageBlob, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject("Something unexpected happened " + error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      },
    );
  });
};

export default upload;
