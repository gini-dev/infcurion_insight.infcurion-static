export class TUHTMLElement extends HTMLElement{tuRenderObserver=new MutationObserver(()=>{this.tuRenderObserver.disconnect();if(this.render){this.render();}});disconnectedCallback(){if(super.disconnectedCallback){super.disconnectedCallback();}
this.tuRenderObserver.disconnect();}
connectedCallback(){if(super.connectedCallback){super.connectedCallback();}
if(this.hasChildNodes()&&this.render){this.render();}else{this.tuRenderObserver.observe(this,{subtree:true,childList:true,characterData:true});}}}