import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const getBlobFroUri = async (uri) => {
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
    });

    return blob;
};


const upload = async (file) => {
    const imageBlob = await getBlobFroUri(file.uri)
    const storage = getStorage();

    /** @type {any} */
    const metadata = {
        contentType: file.mimeType
    };

    const timestamp = new Date();
    const storageRef = ref(storage, `images/${timestamp}` + file.fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageBlob, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject("Something unexpected happened " + error.code)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });

}

export default upload;
