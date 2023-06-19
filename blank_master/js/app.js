class App {
    constructor() {
        this.solution = [];
        this.main_init();
        this.note_view();
        this.hashtag();
        this.click_event();
        this.highlighter();
    }

    main_init() {
        let note_list = JSON.parse(localStorage.getItem("note_list"));

        $(document).ready(function () {
            $("#main .mainList").empty();
            $("#main .mainList").append(`
                <div class="mainItem newItem">
                    <a href="page/new_note.html"><i class="fa-sharp fa-solid fa-plus"></i></a>
                </div>
            `);

            if (note_list) {
                this.note_list = note_list;
                    $(this.note_list).each(function (idx, el) {
                        let hashContainer = $('<div class="hash">');
                        // let hashContainer = $('<div class="hash">');

                        $.each(el.tags, function(tagIdx, tag) {
                            let tagSpan = $('<span>').text(tag);
                            hashContainer.append(tagSpan);
                        });
                        $("#main .mainList").append(`
                            <div class="mainItem">
                                <p><i class="fa-solid fa-circle-check"></i> 문제 생성완료</p>
                                <button class="pin">
                                    <i class="fa-solid fa-thumbtack"></i>
                                </button>
                                <a href="" class="title">${el.title}</a>
                                <p class="date">2023.04.17</p>
                       `);
                        $("#main .mainList .mainItem:last-child").append(hashContainer);
                        $("#main .mainList .mainItem:last-child").append(`
                            <a href="page/noteView.html?idx=${idx}" id="main_note_view_btn">
                                    필기로 바로가기 <i class="fa-solid fa-arrow-right"></i>
                                </a>
                            </div>
                       `);
                    })
            }
        });
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

    create_note = (e) => {
        let note_list = JSON.parse(localStorage.getItem("note_list"));

        let title = $(e.target).parents("#create_note").find("input[name='title']").val();
        let contents = $(e.target).parents("#create_note").find("textarea").val();
        let tagify_tag = $(e.target).parents("#create_note").find(".tagify .tagify__tag-text");
        let tags = [];
        tagify_tag.each(function (idx, el) {
            let hash = $(el).text();
            tags.push(hash);
        });

        let new_note = {
            title : title,
            contents : contents,
            tags : tags
        };

        if (note_list) {
            this.note_list = note_list;
            this.note_list.push(new_note);
        } else {
            this.note_list = [new_note];
        }
        localStorage.setItem("note_list", JSON.stringify(this.note_list));
        location.href = '../index.html';
    }

    note_view() {
        function getParameter(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        let note_list = JSON.parse(localStorage.getItem("note_list"));
        let idx = getParameter("idx");

        if (note_list) {
            $(document).ready(function () {
                $("#note-view").find("h1").text(note_list[idx].title);
                $("#note-view").find("#note-view-content-p").text(note_list[idx].contents);
                $("#note-view .tag_box button").remove();
                $(note_list[idx].tags).each(function (idx, el) {
                    $("#note-view .tag_box").append(`
                        <button>#${el}</button>
                    `);
                });
                $("#note-view").find("#note-view-content-p").text(note_list[idx].contents);
            })
        }
    }

    click_event() {
        $(document).on("click", "#create_note_btn", this.create_note);

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
                            <button data-idx='${idx}' class="problem-item-check">채점</button>
<!--                            <i class="fa-solid fa-delete-left delete-btn"></i>-->
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
