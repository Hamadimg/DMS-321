//images
var menu;
var queue;
var htp1;
var htp2;
var htp3;

//audio
var bkgmusic;

var scene = 0;
var play = 0;
var leader = 0;

// htp = how to play //

function preload() {
  //prepares our content to be accessed

  soundFormats("m4a", "wav", "mp3");
  //menuMusic = loadSound("assets/Menu Music.mp3");

  music = loadSound("sounds/Menu Music.mp3");
  menu = loadImage("assets/TDO Menu Screen Moqup.jpg");
  htp1 = loadImage("assets/TDO HTP Screen 1.jpg");
  htp2 = loadImage("assets/TDO HTP Screen 2.jpg");
  htp3 = loadImage("assets/TDO HTP Screen 3.jpg");
}

function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  print("mouseX=" + mouseX + ", mouseY=" + mouseY);
  if (!music.isPlaying()) {
    music.play();
  }

  if (scene == 0) {
    background(menu);
    if (mouseX > 700 && mouseX < 1215 && mouseY > 360 && mouseY < 460) {
      cursor(HAND);
    } else cursor(ARROW);

    if (mouseX > 705 && mouseX < 1215 && mouseY > 545 && mouseY < 650) {
      cursor(HAND);
    } else cursor(ARROW);

    if (mouseX > 700 && mouseX < 1215 && mouseY > 730 && mouseY < 840) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 1) {
    background(htp1);
    if (mouseX > 1480 && mouseX < 1905 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 2) {
    background(htp2);
        if (mouseX > 740 && mouseX < 1165 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (scene == 3) {
    background(htp3);
    if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      cursor(HAND);
    } else cursor(ARROW);
  }

  if (play == 1) {
    // link or coding for the game //
  }

  if (leader == 1) {
    // link to leaderboard page //
  }
}

function mousePressed() {
  if (scene == 0) {
    if (mouseX > 700 && mouseX < 1215 && mouseY > 360 && mouseY < 460) {
      play = 1;
    }
  }

  if (scene == 0) {
    if (mouseX > 705 && mouseX < 1215 && mouseY > 545 && mouseY < 650) {
      leader = 1;
    }
  }

  if (scene == 0) {
    if (mouseX > 700 && mouseX < 1215 && mouseY > 730 && mouseY < 840) {
      scene = 1;
    }
  }

  if (scene == 1) {
    if (mouseX > 1480 && mouseX < 1905 && mouseY > 890 && mouseY < 1030) {
      scene = 2;
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      scene = 0;
    }
  }

  if (scene == 2) {
    if (mouseX > 740 && mouseX < 1165 && mouseY > 890 && mouseY < 1030) {
      scene = 3;
    } else if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      scene = 1;
    }
  }

  if (scene == 3) {
    if (mouseX > 65 && mouseX < 490 && mouseY > 890 && mouseY < 1030) {
      scene = 2;
    }
  }
}
