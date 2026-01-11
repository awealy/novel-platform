<template>
  <div>
    <h2>Comments</h2>
    <ul>
      <li v - for="comment in comments" :key="comment.id">
        {{ comment.text }} - {{ comment.author }}
      </li>
    </ul>
    <form @submit.prevent="addComment">
      <input v - model="newComment.text" placeholder="Comment text">
      <input v - model="newComment.author" placeholder="Your name">
      <button type="submit">Add Comment</button>
    </form>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

export default {
  props: {
    novelId: String
  },
  data() {
    return {
      comments: [],
      newComment: {
        text: '',
        author: ''
      }
    };
  },
  async created() {
    await this.fetchComments();
  },
  methods: {
    async fetchComments() {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, `novels/${this.novelId}/comments`));
      this.comments = [];
      querySnapshot.forEach((doc) => {
        this.comments.push({ id: doc.id, ...doc.data() });
      });
    },
    async addComment() {
      const db = getFirestore();
      await addDoc(collection(db, `novels/${this.novelId}/comments`), this.newComment);
      await this.fetchComments();
      this.newComment.text = '';
      this.newComment.author = '';
    }
  }
}
</script>