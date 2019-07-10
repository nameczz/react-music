let fakeBind = function(func, context) {
  return function(...args) {
    func.call(context, ...args)
  }
}
let a = 'window'
let obj = {
  a: 1
}
let test = function() {
  console.log(this.a)
}
const newTest = fakeBind(test, obj)
test()
newTest()
