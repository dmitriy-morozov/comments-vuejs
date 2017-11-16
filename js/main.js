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
            newName: '',
            newText: '',
            likeCanClick: true,
            submitClick: false,
            showLoader: true,
            counterLikes: Math.floor(Math.random() * (20 - 1)) + 1
        }
    },
    methods: {
        fetchData: function () {
            axios.get("./php/getcomments.php").then(function (response) {
                this.comments = response.data;
                this.showLoader = false;
                setTimeout(function () {
                    $('.addition-comment__form').trigger("reset");
                }, 100);
            }.bind(this));
        },
        incrementLikes: function () {
            this.counterLikes += 1;
            this.likeCanClick = false;
        },
        checkReview: function (e) {
            e.preventDefault();
            var submitButton = $('.addition-comment__button');
            this.showLoader = true;

            if ((this.newName != '') && (this.newText != '')) {
                submitButton.prop('disabled', false);
                this.sendComment();
            } else {
                var self = this;
                self.showLoader = false;
                self.submitClick = true;
                submitButton.prop('disabled', true);

                setTimeout(function () {
                    self.submitClick = false;
                    submitButton.prop('disabled', false);
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
                self.submitClick = false;
                $('.addition-comment__button').prop('disabled', false);
                self.fetchData();
            });
        },
        handleCmdEnter: function (e) {
            if ((e.metaKey || e.ctrlKey) && e.keyCode == 13) {
                $('#sendComment').trigger('click');
            }
        }
    },
    created() {
        this.fetchData();
    }
});

