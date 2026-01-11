<template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".md,.txt,.html">
  </div>
</template>

<script>
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default {
  methods: {
    async handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const storage = getStorage();
      const storageRef = ref(storage, `novels/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // 处理上传进度
        },
        (error) => {
          console.error('Upload error:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const db = getFirestore();
          const novelDocRef = doc(db, 'novels', file.name);
          await setDoc(novelDocRef, {
            name: file.name,
            url: downloadURL,
            type: file.type
          });
        }
      );
    }
  }
}
</script>
