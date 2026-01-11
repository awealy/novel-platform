<template>
  <div>
    <ul>
      <li v - for="novel in novels" :key="novel.name">
        <router - link :to="`/novel/${novel.name}`">{{ novel.name }}</router - link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      novels: []
    };
  },
  async created() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'novels'));
    querySnapshot.forEach((doc) => {
      this.novels.push({ id: doc.id, ...doc.data() });
    });
  }
}
</script>