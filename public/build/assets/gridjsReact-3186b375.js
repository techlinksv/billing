import{r as p,a}from"./reactbootstrap-d01ac090.js";import{I as s,k as f,w as i,N as l}from"./gridjs-a5d504de.js";/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var c=function(n,t){return(c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])})(n,t)};function u(n,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function e(){this.constructor=n}c(n,t),n.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}(function(n){function t(e){var r=n.call(this,e)||this;return r.wrapper=p.createRef(),r.instance=null,r.instance=new s(e||{}),r}return u(t,n),t.prototype.getInstance=function(){return this.instance},t.prototype.componentDidMount=function(){this.instance.render(this.wrapper.current)},t.prototype.componentDidUpdate=function(){this.instance.updateConfig(this.props).forceRender()},t.prototype.render=function(){return p.createElement("div",{ref:this.wrapper})},t})(p.Component);var h=function(n){function t(){var e=n!==null&&n.apply(this,arguments)||this;return e.ref=f(),e}return u(t,n),t.prototype.componentDidMount=function(){a.render(this.props.element,this.ref.current)},t.prototype.render=function(){return i(this.props.parent,{ref:this.ref})},t.defaultProps={parent:"div"},t}(l);function m(n,t){return i(h,{element:n,parent:t})}export{m as l};
