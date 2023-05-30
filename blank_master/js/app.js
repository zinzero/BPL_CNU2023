class App {
    constructor() {
        this.click_event();
    }

    click_event() {
        $(document).ready(function() {
            $(".hamburger i").click(function () {
                $("#ham").show(200);
            });
            $("#ham .cancel").on("click", function () {
                $("#ham").hide(200);
            });
        });
    };
}
let app = new App();
