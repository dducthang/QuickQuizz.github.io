export class Modal{
    constructor(contentId, fallbackText){
        this.fallbackText = fallbackText;
        this.contentTemplate = document.getElementById(contentId);
        this.modalTemplate = document.getElementById('modal-template')
    }

    show(){
        if('content' in window.document.createElement('template')){
            this.contentEl = document.importNode(this.contentTemplate.content, true);
            const modalEls = document.importNode(this.modalTemplate.content, true);
            this.backdrop = modalEls.querySelector('.backdrop');
            this.modalEl = modalEls.querySelector('.modal');
            this.modalEl.appendChild(this.contentEl);
            document.body.insertAdjacentElement('afterbegin',this.backdrop);
            document.body.insertAdjacentElement('afterbegin',this.modalEl);
        }
        else alert(this.fallbackText);
    }

    hide(){
        if(this.modalEl){
            document.body.removeChild(this.modalEl)
            document.body.removeChild(this.backdrop)
            this.backdrop==null;
            this.modalEl==null;
        }
    }
}