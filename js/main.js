Vue.component('review-item', {
    props: ['review'],
    template:   '<div class="review">' +
                '  <div class="review__author-date">' +
                '    <span class="review__author-name"> {{ review.name }} </span>' +
                '    <span class="review__date">{{ review.date }} </span>' +
                '  </div>' +
                '  <div class="review__text-wrapper">' +
                '       <p class="review__text"> {{ review.text }}</p>' +
                '  </div>' +
                '</div>'
});

Vue.component('service-item', {
    props: ['service'],
    template:   '<div class="services__row">' +
                '   <div class="services__cell">' +
                '       <span> {{ service.title }}</span>' +
                '       <div class="services__graph"></div>' +
                '   </div>' +
                '   <div class="services__cell">' +
                '       <span> {{ service.number }} </span>' +
                '   </div>' +
                '</div>'
});


var vm = new Vue({
    el: '.main-wrapper',
    data: function () {
        return {
            comments: [],
            commentsListing: [],
            servicesList:
                [
                    {title: "Ручное бронирование", number: 11},
                    {title: "Пакетные туры", number: 3},
                    {title: "Отели", number: 1}
                ],
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

        fullDate: function () {
            var date = new Date();

            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timezone: 'UTC',
                hour: 'numeric',
                minute: 'numeric'
            };

            return date.toLocaleString("ru", options)
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
            var date = self.fullDate();

            axios.post('./php/postcomments.php', {
                name: this.newName,
                text: this.newText,
                date: date
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
            self.commentsListing = '';
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

