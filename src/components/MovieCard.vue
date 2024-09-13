<template>
    <div class="movie-card">
        <!-- 영화 포스터 이미지 -->
        <img :src="posterUrl || require('@/assets/no.png')" alt="영화 포스터" class="movie-poster" />

        <h2>{{ movie.movieNm }}</h2>
        <p><strong>감독:</strong> {{ directorName }}</p>
        <p><strong>개봉연도:</strong> {{ movie.openDt || '정보 없음' }}</p>
        <router-link :to="`/movie/${movie.movieCd}`">자세히 보기</router-link>
    </div>
</template>

<script>
import '../assets/movieCard.css'; //css 가져오기

export default {
    props: {
        movie: Object, // 부모로부터 전달받은 영화 객체
    },
    data() {
        return {
            posterUrl: '', // 포스터 이미지 URL 저장
        };
    },
    computed: {
        directorName() {
            return this.movie.directors?.[0]?.peopleNm || '정보 없음';
        },
    },
    methods: {
        async fetchMoviePoster() {
            try {
                const response = await fetch(
                    `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&title=${encodeURIComponent(this.movie.movieNm)}&ServiceKey=525X4C9X8C60JJCMS57Q`
                );
                if (!response.ok) throw new Error('포스터 이미지를 가져오는 데 실패했습니다.');

                const data = await response.json();
                const result = data.Data?.[0]?.Result?.[0];

                if (result?.posters) {
                    this.posterUrl = result.posters.split('|')[0]; // 첫 번째 포스터 이미지 사용
                }
            } catch (error) {
                console.error('Error fetching movie poster:', error);
            }
        },
    },
    mounted() {
        this.fetchMoviePoster(); // 컴포넌트가 마운트되면 포스터 이미지를 가져옴
    },
};
</script>
