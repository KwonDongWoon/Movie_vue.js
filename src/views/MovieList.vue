<template>
    <div>
        <header class="header">
            <h1>영화 검색 사이트</h1>
        </header>
        <!-- 검색창 -->
        <div class="search-container">
            <input v-model="searchTerm" @keyup.enter="handleSearch" placeholder="영화 제목을 입력하세요" class="search-input" />
            <button @click="handleSearch" class="search-button">검색하기</button>
        </div>
        <!-- 영화 목록 -->
        <div class="movie-list">
            <MovieCard v-for="movie in movies" :key="movie.movieCd" :movie="movie" />
        </div>
    </div>
</template>

<script>
import MovieCard from '../components/MovieCard.vue';
import '../assets/movieList.css'; //css 가져오기

export default {
    components: { MovieCard },
    data() {
        return {
            movies: [],
            searchTerm: '',
        };
    },
    methods: {
        async fetchMovies() {
            if (!this.searchTerm.trim()) {
                alert('검색어를 입력하세요.');
                return;
            }

            try {
                const response = await fetch(`https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=6e9428bca580dfc07301a04058fb46dd&movieNm=${this.searchTerm}`);
                if (!response.ok) throw new Error('네트워크 응답이 실패했습니다.');
                const data = await response.json();
                this.movies = data.movieListResult?.movieList || [];
                if (this.movies.length === 0) alert('검색 결과가 없습니다.');
            } catch (error) {
                console.error('영화 정보를 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        handleSearch() {
            this.fetchMovies();
        },
    },
};
</script>
