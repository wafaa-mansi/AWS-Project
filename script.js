const video =
    document.getElementById("video");

const qualitySelect =
    document.getElementById("quality");

const currentQuality =
    document.getElementById("currentQuality");

const status =
    document.getElementById("status");

const videoURL =
    "/hls/hls/master.m3u8";


if (Hls.isSupported()) {

    const hls =
        new Hls();


    hls.loadSource(videoURL);


    hls.attachMedia(video);


    hls.on(
        Hls.Events.MANIFEST_PARSED,
        function () {

            status.textContent =
                "Video ready";


            hls.levels.forEach(
                function (level, index) {

                    const option =
                        document.createElement("option");

                    option.value =
                        index;

                    option.textContent =
                        level.height + "p";

                    qualitySelect.appendChild(
                        option
                    );

                }
            );

        }
    );


    qualitySelect.addEventListener(
        "change",
        function () {

            const selectedLevel =
                parseInt(
                    qualitySelect.value
                );


            if (selectedLevel === -1) {

                hls.currentLevel =
                    -1;

                currentQuality.textContent =
                    "Current Quality: Auto";

            }

            else {

                hls.currentLevel =
                    selectedLevel;

                currentQuality.textContent =
                    "Current Quality: " +
                    hls.levels[selectedLevel].height +
                    "p";

            }

        }
    );


    hls.on(
        Hls.Events.LEVEL_SWITCHED,
        function (event, data) {

            const level =
                hls.levels[data.level];


            if (
                qualitySelect.value === "-1"
            ) {

                currentQuality.textContent =
                    "Current Quality: Auto (" +
                    level.height +
                    "p)";

            }

        }
    );


    hls.on(
        Hls.Events.ERROR,
        function (event, data) {

            console.log(
                "HLS Error:",
                data
            );


            if (data.fatal) {

                status.textContent =
                    "Video failed to load. Check CloudFront URL and CORS.";

            }

        }
    );

}


else if (
    video.canPlayType(
        "application/vnd.apple.mpegurl"
    )
) {

    video.src =
        videoURL;


    video.addEventListener(
        "loadedmetadata",
        function () {

            status.textContent =
                "Video ready";

        }
    );

}


else {

    status.textContent =
        "HLS is not supported by this browser.";

}