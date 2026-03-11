const StarrySky = (function () {
  let canvas,
    ctx,
    width,
    height,
    stars,
    colorList,
    radius,
    focalLevel,
    countLevel,
    speedLevel,
    focal,
    count,
    raf;
  return {
    init: function (el) {
      if (el && "CANVAS" === el.nodeName) {
        ((canvas = el),
          (canvas.width = canvas.clientWidth),
          (canvas.height = canvas.clientHeight),
          (canvas.style.backgroundColor = "black"),
          (ctx = canvas.getContext("2d")),
          (width = canvas.clientWidth),
          (height = canvas.clientHeight),
          (colorList = ["255, 255, 255"]),
          (radius = 1),
          (focalLevel = 0.4),
          (countLevel = 0.3),
          (speedLevel = 5e-4),
          (focal = width * focalLevel),
          (count = Math.ceil(width * countLevel)),
          (stars = []));
        for (let i = 0; i < count; i++)
          stars[i] = {
            x: width * (0.1 + 0.8 * Math.random()),
            y: height * (0.1 + 0.8 * Math.random()),
            z: focal * Math.random(),
            color: colorList[Math.ceil(1e3 * Math.random()) % colorList.length],
          };
        const self = this;
        canvas.addEventListener(
          "resize",
          self.throttle(function () {
            ((canvas.width = canvas.clientWidth),
              (canvas.height = canvas.clientHeight),
              (width = canvas.clientWidth),
              (height = canvas.clientHeight),
              (focal = width * focalLevel));
            const newCount = Math.ceil(width * countLevel);
            count > newCount
              ? stars.splice(newCount)
              : count < newCount &&
                (function () {
                  let num = newCount - count;
                  for (; num--; )
                    stars.push({
                      x: width * (0.1 + 0.8 * Math.random()),
                      y: height * (0.1 + 0.8 * Math.random()),
                      z: focal * Math.random(),
                      color:
                        colorList[
                          Math.ceil(1e3 * Math.random()) % colorList.length
                        ],
                    });
                })();
            count = Math.ceil(width * countLevel);
          }, 200),
        );
      } else console.error("初始化失败，必须传入 Canvas 元素");
    },
    setSkyColor: function (c) {
      canvas.style.backgroundColor = c || "black";
    },
    setStarRadius: function (r) {
      radius = r || 1;
    },
    setFocalDistanceLevel: function (l) {
      ((focalLevel = l || 0.4), (focal = width * focalLevel));
    },
    setStarCountLevel: function (l) {
      countLevel = l || 0.3;
      const newCount = Math.ceil(width * countLevel);
      count > newCount
        ? stars.splice(newCount)
        : count < newCount &&
          (function () {
            let num = newCount - count;
            for (; num--; )
              stars.push({
                x: width * (0.1 + 0.8 * Math.random()),
                y: height * (0.1 + 0.8 * Math.random()),
                z: focal * Math.random(),
                color:
                  colorList[Math.ceil(1e3 * Math.random()) % colorList.length],
              });
          })();
      count = Math.ceil(width * countLevel);
    },
    setStarSpeedLevel: function (s) {
      speedLevel = s || 5e-4;
    },
    setStarColorList: function (c, sync) {
      ("object" == typeof c
        ? (colorList = c)
        : "string" == typeof c && colorList.push(c),
        sync &&
          (function () {
            for (let i = 0; i < stars.length; i++)
              stars[i].color =
                colorList[Math.ceil(1e3 * Math.random()) % colorList.length];
          })());
    },
    render: function () {
      const speed = width * focalLevel * speedLevel;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i],
          x = (star.x - width / 2) * (focal / star.z) + width / 2,
          y = (star.y - height / 2) * (focal / star.z) + height / 2;
        if (
          ((star.z -= speed),
          star.z > 0 &&
            star.z <= focal &&
            x >= -20 &&
            x <= width + 20 &&
            y >= -20 &&
            y <= height + 20)
        ) {
          const r = radius * ((focal / star.z) * 0.8),
            opacity = 1 - 0.8 * (star.z / focal);
          ((ctx.fillStyle = "rgba(" + star.color + ", " + opacity + ")"),
            (ctx.shadowOffsetX = 0),
            (ctx.shadowOffsetY = 0),
            (ctx.shadowColor = "rgb(" + star.color + ")"),
            (ctx.shadowBlur = 10),
            ctx.beginPath(),
            ctx.arc(x, y, r, 0, 2 * Math.PI),
            ctx.fill());
        } else {
          const z = focal * Math.random();
          ((star.x = width * (0.1 + 0.8 * Math.random())),
            (star.y = height * (0.1 + 0.8 * Math.random())),
            (star.z = z),
            (star.color =
              colorList[Math.ceil(1e3 * Math.random()) % colorList.length]));
        }
      }
      const self = this;
      requestAnimationFrame(function () {
        self.render();
      });
    },
    destroy: function () {
      (cancelAnimationFrame(raf),
        (stars = []),
        ctx.clearRect(0, 0, width, height),
        (canvas.width = 0),
        (canvas.height = 0));
    },
    debounce: function (fn, delay = 200) {
      let timer;
      return function () {
        (timer && clearTimeout(timer),
          (timer = setTimeout(function () {
            fn();
          }, delay)));
      };
    },
    throttle: function (fn, delay = 200) {
      let timer = null,
        last = 0;
      return function () {
        Date.now() - last > delay
          ? (clearTimeout(timer), (last = Date.now()), fn())
          : (timer = setTimeout(fn, delay));
      };
    },
  };
})();
