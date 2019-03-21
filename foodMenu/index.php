<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:200,300,400,500&amp;subset=latin-ext" rel="stylesheet">
    <link href="../src/reset.css" rel="stylesheet" type="text/css">
    <!--<link href="https://dev.tsyganok.net/web/timetable/css/common.css" rel="stylesheet" type="text/css">-->
    <link href="../src/mainStyle.css" rel="stylesheet" type="text/css">
</head>
<body>
<div id="bg">
    <div id="bg_1">

    </div>
    <div id="bg_2">
    </div>
    <div id="bg_3">

    </div>
    <div id="bg_4">

    </div>

</div>
<main>
    <!--<?echo $url;?>-->
</main>
</body>
<script>
    const foodJson = <?echo $result?>;
    const date = new Date();
    const timeNow = 23 - date.getHours();
    setTimeout(reload, (timeNow+1)*1000*60*60); //calls reload approximately at midnight
    //setInterval(reload, 6000);
    function reload ()
    {
        location.reload();
    }

    for(let i = 0; i<foodJson.courses.length; i++)
    {
        document.querySelector("main").innerHTML+=(`
            <div id="${i}" class="foodBlock">
                <h2>
                    ${foodJson.courses[i].title_fi.replace(/,/g, ", ")}
                </h2>
                <h3>
                    ${foodJson.courses[i].price}
                </h3>
            </div>
        `);
        document.getElementsByClassName("foodBlock")[i].style.height=`${(window.innerHeight-16)/foodJson.courses.length}px`;
    }
</script>
</html>