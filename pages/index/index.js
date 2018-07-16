//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    score: 0,
    bestScore: 0,
    userInfo: {
      "nickName": "Riddle",
      "gender": 2,
      "language": "zh_CN",
      "city": "Newcastle",
      "province": "New South Wales",
      "country": "Australia",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJFuSYibjQWBPGX1rYMWpbbBRBbfWicjAlU9KdynBwJiau6j90JibRRun2416qTBeRB1WRxxib6RS8L2GA/132"
    },
    boxArr: [],
    position: {
      x: 0,
      y: 0
    },
    color: [
      'background:rgb(236,228,219);color: rgb(121, 114, 103);',
      'background:rgb(235,224,203);color: rgb(121, 114, 103);',
      'background:rgb(231,179,129)',
      'background:rgb(231,153,108)',
      'background:rgb(229,130,102)',
      'background:rgb(227,103,71)',
      'background:rgb(232,208,127)',
      'background:rgb(231,205,113)',
      'background:rgb(231,201,100)',
      'background:rgb(230,198,89)',
      'background:rgb(230,195,79);border: 1px solid rgb(238,215,138)',
    ],
    myScore: 0,
    over: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.init()
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  produce: function () {
    for(let i = 0; i < 2; i ++) {
      let position = Math.round(Math.random()*15)
      let n = 0
      while(JSON.stringify(this.data.boxArr[position]) != '{}') {
        position = Math.round(Math.random()*15)
        n++
        if(n > 15) {
          if(this.canContinue) {
            return
          } else {
            this.over = true
          }
        }
      }
      let num1 = Math.random() > 0.9 ? 2 : 1
      let num2 = Math.pow(2, num1)
      this.data.boxArr[position] = {
        "num": num1,
        "num2": num2
      }
      this.setData({
        boxArr: this.data.boxArr
      })
    }

  },
  start: function (e) {
    let x = e.changedTouches[0].pageX
    let y = e.changedTouches[0].pageY
    console.log('start',x, y)
    this.setData({
      "position.x": x,
      'position.y': y
    })
  },
  end: function (e) {
    let x = e.changedTouches[0].pageX
    let y = e.changedTouches[0].pageY
    console.log('end',x, y)
    let direction = Math.abs(x-this.data.position.x) > Math.abs(y-this.data.position.y) ? 'x' : 'y'
    if (direction == 'x') {
      direction = x > this.data.position.x ? 'right' : 'left'
    } else if (direction == 'y') {
      direction = y > this.data.position.y ? 'bottom' : 'top'
    }
    console.log(direction)
    if(direction == 'top') {
      this.top()
    } else if(direction == 'bottom') {
      this.bottom()
    } else if(direction == 'left') {
      this.left()
    } else if(direction == 'right') {
      this.right()
    }
    let that = this
    let setCode = setTimeout(() => {
      that.produce()
      clearTimeout(setCode)
    }, 300);

  },
  getScore: function (num) {
    num += this.data.myScore
    this.setData({
      'myScore': num
    })
  },
  init: function () {
    let  arr = []
    this.data.over = false
    for (let i = 0; i < 16; i ++) {
      arr.push({}) 
    }
    this.setData({
      'boxArr': arr,
      'over': this.data.over
    })
    this.produce()
  },
  combine: function () {

  },
  movet: function () {
      for(let i = 0; i < 16; i ++) {
        let n = Math.floor(i/4)
        for(var j = n; j > 0 ; j --) {
          if(!this.data.boxArr[i-j*4].num) {
            break
          }
        }
        if(this.data.boxArr[i] && j > 0) {
          this.data.boxArr[i-j*4] = this.data.boxArr[i]
          this.data.boxArr[i] = {}
        }
    }
  },
  top: function() {
    this.movet()
    let rest = []
    for(let i = 4; i < 16; i ++) {
      let record = i % 4
      var flag = true
      rest.map(x => {
        if(record == x) {
          flag = false
        }
      })
      if(JSON.stringify(this.data.boxArr[i]) != '{}' && this.data.boxArr[i].num === this.data.boxArr[i-4].num && flag) {
        let temp = +this.data.boxArr[i-4].num + 1
        this.data.boxArr[i-4].num = temp
        this.data.boxArr[i-4].num2 = Math.pow(2, temp)
        this.data.boxArr[i] = {}
        rest.push(record)
        this.movet()
        this.setData({
          'boxArr': this.data.boxArr
        })
        this.getScore(Math.pow(2, temp))
      }
    }
    this.setData({
      'boxArr': this.data.boxArr
    })
  },
  moveb: function () {
    for(let i = 15; i >= 0; i --) {
      let n = Math.floor((15 - i)/4)
      for(var j = n; j > 0 ; j --) {
        if(!this.data.boxArr[i + j*4].num) {
          break
        }
      }
      if(this.data.boxArr[i] && j > 0) {
        this.data.boxArr[i + j*4] = this.data.boxArr[i]
        this.data.boxArr[i] = {}
      }
    }
  },
  bottom: function() {
    this.moveb()
    let rest = []
    for(let i = 11; i >= 0; i --) {
      let record = i % 4
      var flag = true
      rest.map(x => {
        if(record == x) {
          flag = false
        }
      })
      if(JSON.stringify(this.data.boxArr[i]) != '{}' && this.data.boxArr[i].num === this.data.boxArr[i + 4].num && flag) {
        let temp = +this.data.boxArr[i + 4].num + 1
        this.data.boxArr[i + 4].num = temp
        this.data.boxArr[i + 4].num2 = Math.pow(2, temp)
        this.data.boxArr[i] = {}
        rest.push(record)
        this.moveb()
        this.setData({
          'boxArr': this.data.boxArr
        })
        this.getScore(Math.pow(2, temp))
      }
    }
    this.setData({
      'boxArr': this.data.boxArr
    })
  },
  mover: function () {
    for(let i = 15; i >= 0 ; i --) {
      if(JSON.stringify(this.data.boxArr[i]) == '{}') {
        continue
      }
      let n = Math.floor(i / 4)
      for(let j = n * 4 + 3; j > i ; j --) {
        if(JSON.stringify(this.data.boxArr[j]) == '{}'  ){
          this.data.boxArr[j] = this.data.boxArr[i]
          this.data.boxArr[i] = {}
          break
        }
      }
    }
  },
  right: function() {
    this.mover()
    let rest = []
    for(let i = 15; i > 0; i--) {
      let record = Math.floor(i / 4)
      let flag = true
      rest.map(x => {
        if(record == x) {
          flag = false
        }
      })
      if(JSON.stringify(this.data.boxArr[i]) != '{}' && this.data.boxArr[i].num === this.data.boxArr[i - 1].num && flag) {
            let temp = +this.data.boxArr[i].num + 1
            this.data.boxArr[i].num = temp
            this.data.boxArr[i].num2 = Math.pow(2, temp)
            this.data.boxArr[i - 1] = {}
            rest.push(record)
            this.mover()
            this.setData({
              'boxArr': this.data.boxArr
            })
            this.getScore(Math.pow(2, temp))
        }
    }
    this.setData({
      'boxArr': this.data.boxArr
    })
  },
  movel: function () {
    for(let i = 0; i < 16 ; i ++) {
      if(JSON.stringify(this.data.boxArr[i]) == '{}') {
        continue
      }
      let n = Math.floor(i / 4)
      for(let j = n * 4 ; j < i ; j ++) {
        if(JSON.stringify(this.data.boxArr[j]) == '{}'  ){
          this.data.boxArr[j] = this.data.boxArr[i]
          this.data.boxArr[i] = {}
          break
        }
      }
    }
  },
  left: function() {
    this.movel()
    let rest = []
    for(let i = 0; i < 15; i ++) {
      let record = Math.floor(i / 4)
      let flag = true
      rest.map(x => {
        if(record == x) {
          flag = false
        }
      })
      if(JSON.stringify(this.data.boxArr[i]) != '{}' && this.data.boxArr[i].num === this.data.boxArr[i + 1].num && flag) {
            let temp = +this.data.boxArr[i].num + 1
            this.data.boxArr[i + 1].num = temp
            this.data.boxArr[i + 1].num2 = Math.pow(2, temp)
            this.data.boxArr[i] = {}
            rest.push(record)
            this.movel()
            this.setData({
              'boxArr': this.data.boxArr
            })
            this.getScore(Math.pow(2, temp))
        }
    }
    this.setData({
      'boxArr': this.data.boxArr
    })
  },
  canContinue: function () {
    for(let i = 0; i < 15; i ++) {
      if( (this.data.boxArr[i] || {}).num == (this.data.boxArr[i - 1] || {}).num) 
      {
        return 1
      } else if( (this.data.boxArr[i] || {}).num == (this.data.boxArr[i - 1] || {}).num) {
        return 1
      } else if((this.data.boxArr[i ] || {}).num == (this.data.boxArr[i + 4] || {}).num) {
        return 1
      } else if((this.data.boxArr[i ] || {}).num == (this.data.boxArr[i - 4] || {}).num) {
        return 1
      }
    }
    return 0
  }
})
                                                                                                                                                 