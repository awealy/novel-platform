<template>
  <div>
    <h1>{{ novel.name }}</h1>
    <div v - if="novel.type === 'text/markdown'">
      <div v - html="markdownContent"></div>
    </div>
    <div v - else - if="novel.type === 'text/plain'">
      <pre>{{ textContent }}</pre>
    </div>
    <div v - else - if="novel.type === 'text/html'">
      <div v - html="htmlContent"></div>
    </div>
    <CommentSection :novelId="novel.id" />
  </div>
</template>

<script>
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import markdownIt from'markdown - it';
import CommentSection from './CommentSection.vue';

export default {
  components: {
    CommentSection
  },
  data() {
    return {
      novel: null,
      markdownContent: '',
      textContent: '',
      htmlContent: ''
    };
  },
  async created() {
    const storage = getStorage();
    const storageRef = ref(storage, `novels/${this.$route.params.novelName}`);
    const url = await getDownloadURL(storageRef);

    const response = await fetch(url);
    const text = await response.text();

    if (this.$route.params.type === 'text/markdown') {
      this.markdownContent = markdownIt().render(text);
    } else if (this.$route.params.type === 'text/plain') {
      this.textContent = text;
    } else if (this.$route.params.type === 'text/html') {
      this.htmlContent = text;
    }

    const db = getFirestore();
    const novelDocRef = doc(db, 'novels', this.$route.params.novelName);
    const docSnap = await getDoc(novelDocRef);
    this.novel = docSnap.data();
  }
}
</script>