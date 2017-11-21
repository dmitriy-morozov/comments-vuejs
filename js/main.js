Vue.component('review-item', {
    props: ['review'],
    template: '<div class="review">' +
    '  <div class="review__author-date">' +
    '    <span class="review__author-name"> {{ review.name }} </span>' +
    '    <span class="review__date">{{ fullDate() }} </span>' +
    '  </div>' +
    '  <div class="review__text-wrapper">' +
    '       <p class="review__text"> {{ review.text }}</p>' +
    '  </div>' +
    '</div>',
    methods: {
        fullDate: function () {
            return this.review.day + ' ' + this.review.month + ' ' + this.review.year
        }
    }
});


var vm = new Vue({
    el: '.main-wrapper',
    data: function () {
        return {
            comments: [],
            commentsListing: [],
            newName: '',
            newText: '',
            pagination: false,
            pageNumbers: 1,
            itemsPerPage: 5,
            firstPage: 1,
            likeCanClick: true,
            submitError: false,
            disableClick: false,
            showLoader: true,
            counterLikes: Math.floor(Math.random() * (20 - 1)) + 1
        }
    },
    components: {
        paginate: VuejsPaginate
    },
    methods: {
        incrementLikes: function () {
            this.counterLikes += 1;
            this.likeCanClick = false;
        },

        handleCmdEnter: function (e) {
            var self = this;
            if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
                self.checkReview(e);
            }
        },

        fetchData: function () {
            var self = this;

            axios.get("./php/getcomments.php").then(function (response) {
                this.comments = response.data.reverse();

                setTimeout(function () {
                    self.newName = '';
                    self.newText = '';
                }, 100);

                self.listPagination(self.firstPage);
            }.bind(this));
        },

        checkReview: function (e) {
            e.preventDefault();
            var self = this;
            this.showLoader = true;

            if ((this.newName != '') && (this.newText != '')) {
                self.disableClick = true;
                this.sendComment();
            } else {
                self.showLoader = false;
                self.submitError = true;
                self.disableClick = true;

                setTimeout(function () {
                    self.submitError = false;
                    self.disableClick = false;
                }, 1000);
            }
        },

        sendComment: function () {
            var self = this;
            var day = new Date().getDate();
            var monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
                "июля", "августа", "сентября", "октября", "ноября", "декабря"];
            var month = monthNames[new Date().getMonth()];
            var year = new Date().getFullYear();

            axios.post('./php/postcomments.php', {
                name: this.newName,
                text: this.newText,
                day: day,
                month: month,
                year: year
            }).then(function () {
                self.submitError = false;
                self.disableClick = false;
                self.$refs.pagination.selected = 0;
                self.fetchData();
            });
        },

        listPagination: function (pageNum) {
            var self = this;
            self.showLoader = true;
            self.pageNumbers = Math.ceil(self.comments.length / self.itemsPerPage);

            if (self.pageNumbers > 1) {
                self.pagination = true;
            }

            var index = (pageNum - 1) * self.itemsPerPage;
            self.commentsListing = self.comments.slice(index, index + self.itemsPerPage);

            setTimeout(function () {
                self.showLoader = false;
            }, 500);
        }
    },
    created() {
        this.fetchData();
    }
});

