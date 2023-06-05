class App {
    constructor() {
        this.solution = [];
        this.hashtag();
        this.click_event();
        this.highlighter();
    }

    highlighter() {
        $(document).ready(function() {
            $('#note-view .content p').textHighlighter(false);
            let hltr = $('#note-view .content p').getHighlighter();
        });
    }

    hashtag() {

        $(document).on("click", "#hashtag label", function () {
            $(this).toggleClass("clicked");
        })

        $(document).ready(function () {
            $("#hashtag input").change(function () {
                let checked_list = $("#hashtag input:checked").map(function () {
                    return $(this).val();
                }).get();

                if (checked_list.length > 0) {
                    $("#main .mainList .mainItem").hide();
                    $("#main .mainList .mainItem.newItem").show();

                    $("#main .mainList .mainItem").each(function () {
                        let item = $(this);
                        let item_hash = item.find(".hash span");
                        let item_tags = [];

                        item_hash.each(function () {
                            let hash = $(this).text().substring(1); // '#' 제거
                            item_tags.push(hash);
                        });

                        let show_item = checked_list.every(function (tag) {
                            return item_tags.includes(tag);
                        });

                        if (show_item) {
                            item.show();
                        } else {
                            item.hide();
                        }
                    });
                } else {
                    $("#main .mainList .mainItem").show();
                }
            });
        });

    }

    click_event() {
        $(document).ready(function() {
            // hamburger menu toggle
            $(".hamburger i").click(function () {
                $("#ham").show(200);
            });
            $("#ham .cancel").on("click", function () {
                $("#ham").hide(200);
            });


            // note view modify
            let txt = $("#note-view h1").text();
            $("#note-view-makequiz").on("click", function () {
                $(".problems").show();
                $(".problems").empty();
                let solutions = [];
                $("#note-view-content-p span").each(function (idx, el) {
                    let element_txt = $(el).text();
                    solutions.push(element_txt);
                    $(el).text(idx+1 +"번 문제");
                    $(el).replaceTag('<span class="note-quiz-problem"></span>', false);
                    $(".problems").append(`
                        <div class="problem-item">
                            <p>${idx+1}번 문제</p>
                            <input type="text" placeholder="답을 입력해주세요.">
                            <button data-idx='${idx}' class="problem-item-check">채점하기</button>
                        </div>
                    `);
                });
                $("#note-view h1").text("[Quiz] "+txt);
                // this.solution = solutions;
                localStorage.setItem("solutions", JSON.stringify(solutions));
            });

            $(document).on("click", ".problem-item-check", function () {
                $(".problem-item i").remove();
                let idx = $(this).data('idx');
                let storage = JSON.parse(localStorage.getItem("solutions"));
                let val = $(this).siblings("input").val();
                if (storage[idx] === val) {
                    $(this).parents(".problem-item").append(`
                        <i class="fa-solid fa-check"></i>
                    `);
                } else {
                    $(this).parents(".problem-item").append(`
                        <i class="fa-solid fa-x"></i>
                    `);
                }
            });
        });
    };
}

$.extend({
    replaceTag: function (currentElem, newTagObj, keepProps) {
        let $currentElem = $(currentElem);
        let i, $newTag = $(newTagObj).clone();
        if (keepProps) {//{{{
            newTag = $newTag[0];
            newTag.className = currentElem.className;
            $.extend(newTag.classList, currentElem.classList);
            $.extend(newTag.attributes, currentElem.attributes);
        }//}}}
        $currentElem.wrapAll($newTag);
        $currentElem.contents().unwrap();
        // return node; (Error spotted by Frank van Luijn)
        return this; // Suggested by ColeLawrence
    }
});

$.fn.extend({
    replaceTag: function (newTagObj, keepProps) {
        // "return" suggested by ColeLawrence
        return this.each(function() {
            jQuery.replaceTag(this, newTagObj, keepProps);
        });
    }
});

let app = new App();
