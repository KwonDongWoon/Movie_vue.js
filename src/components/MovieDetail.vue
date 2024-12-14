<template>
    <div v-if="movieDetail" class="movie-detail">
        <h1>{{ movieDetail.movieNm }}</h1>
        <!-- 포스터 이미지가 없는 경우 기본 이미지 사용 -->
        <img :src="posterUrl" alt="영화 포스터" />
        <p><strong>감독:</strong> {{ directorNames }}</p>
        <p><strong>출연:</strong> {{ actorNames }}</p>
        <p><strong>제작년도:</strong> {{ movieDetail.prdtYear || '정보 없음' }}</p>
        <p><strong>영화유형:</strong> {{ movieDetail.typeNm || '정보 없음' }}</p>
        <p><strong>웹사이트:</strong> <a :href="kmdbUrl" target="_blank">{{ kmdbUrl }}</a></p>
    </div>
    <div v-else>
        <p>영화 정보를 불러오는 중입니다...</p>
    </div>
</template>

<script>
import '../assets/movieDetail.css'; //css 가져오기

const API_KEY1 = process.env.VUE_APP_API_KEY1;
const API_KEY2 = process.env.VUE_APP_API_KEY2;


export default {
    data() {
        return {
            movieDetail: null, // 영화 상세 정보를 저장
            posterUrl: require('@/assets/no.png'), // 기본 포스터 이미지
            kmdbUrl: '', // KMDB URL을 저장
        };
    },
    computed: {
        directorNames() {
            return this.movieDetail?.directors?.map(director => director.peopleNm).join(', ') || '정보 없음';
        },
        actorNames() {
            return this.movieDetail?.actors?.map(actor => actor.peopleNm).join(', ') || '정보 없음';
        },
    },
    methods: {
        async fetchMovieDetail() {
            const movieId = this.$route.params.movieCd; // 경로에서 영화 ID 가져오기
            try {
                const response = await fetch(`https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${API_KEY2}&movieCd=${movieId}`);
                if (!response.ok) throw new Error('영화 상세 정보를 가져오는 데 실패했습니다.');
                const data = await response.json();
                this.movieDetail = data.movieInfoResult.movieInfo;

                // KMDB에서 영화 포스터와 URL 가져오기
                await this.fetchMoviePoster(this.movieDetail.movieNm);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        },
        async fetchMoviePoster(movieName) {
            try {
                const response = await fetch(`https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&title=${movieName}&ServiceKey=${API_KEY1}`);
                const data = await response.json();
                const result = data.Data[0]?.Result[0];

                if (result) {
                    this.posterUrl = result.posters?.split('|')[0] || this.posterUrl; // 첫 번째 포스터 이미지 사용
                    this.kmdbUrl = result.kmdbUrl || ''; // KMDB URL 설정
                }
            } catch (error) {
                console.error('Error fetching movie poster:', error);
            }
        },
    },
    mounted() {
        this.fetchMovieDetail(); // 컴포넌트가 마운트되면 영화 정보를 가져옴
    },
};
</script>
