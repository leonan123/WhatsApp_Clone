import { Format } from '../util/Format';
import { CameraController } from './CameraController';
import { DocumentPreviewController } from './DocumentPreviewController';

export class WhatsAppController {
    constructor() {
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
    }
    loadElements() {

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelCase(element.id)] = element;

        })

    }

    elementsPrototype() {

        Element.prototype.hide = function () {

            this.style.display = 'none';

            return this;

        }

        Element.prototype.show = function () {

            this.style.display = 'block';

            return this;

        }

        Element.prototype.toggle = function () {

            this.style.display = (this.style.display === 'none') ? 'block' : 'none';

            return this;

        }

        Element.prototype.on = function (events, fn) {

            events.split(' ').forEach(event => {

                this.addEventListener(event, fn);

            })

            return this;
        }


        Element.prototype.css = function (styles) {

            for (let name in styles) {

                this.style[name] = styles[name];

            }

            return this;

        }


        Element.prototype.addClass = function (name) {

            this.classList.add(name)

            return this;

        }


        Element.prototype.removeClass = function (name) {

            this.classList.remove(name);

            return this;

        }

        Element.prototype.toggleClass = function (name) {

            this.classList.toggle(name);

            return this;

        }

        Element.prototype.hasClass = function (name) {

            return this.classList.contains(name);

        }

        Element.prototype.text = function (text = null) {

            return text ? this.innerHTML = text : this.innerHTML;

        }

        HTMLFormElement.prototype.getForm = function () {

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function () {

            let json = {}

            this.getForm().forEach((value, key) => {

                json[key] = value;

            })

            return json;

        }

    }

    initEvents() {

        this.el.myPhoto.on('click', ev => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            setTimeout(() => {

                this.el.panelEditProfile.addClass('open');

            }, 300)

        })

        this.el.btnNewContact.on('click', ev => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();

            setTimeout(() => {

                this.el.panelAddContact.addClass('open');

            }, 300)


        })

        this.el.btnClosePanelEditProfile.on('click', ev => {

            this.el.panelEditProfile.removeClass('open');

        })

        this.el.btnClosePanelAddContact.on('click', ev => {

            this.el.panelAddContact.removeClass('open');

        })

        this.el.photoContainerEditProfile.on('click', ev => {

            this.el.inputProfilePhoto.click();

        })


        this.el.inputNamePanelEditProfile.on('keypress', ev => {

            if (ev.key === "Enter") {
                ev.preventDefault();

                this.el.btnSavePanelEditProfile.click();
            }

        })

        this.el.btnSavePanelEditProfile.on('click', ev => {

            console.log(this.el.inputNamePanelEditProfile.text());

        })

        this.el.formPanelAddContact.on('submit', ev => {

            ev.preventDefault();

            let formData = new FormData(this.el.formPanelAddContact);

        })

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

            item.on('click', ev => {

                this.el.home.hide();
                this.el.main.css({ display: 'flex' });

            })

        })

        this.el.btnAttach.on('click', ev => {

            ev.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));

        })

        this.el.btnAttachPhoto.on('click', ev => {

            this.el.inputPhoto.click();

        })

        this.el.inputPhoto.on('change', ev => {

            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file => {

                console.log(file);

            })

        })

        this.el.btnAttachCamera.on('click', ev => {

            this.closeAllMainPanel()
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({ height: 'calc(100%)' })

            this._camera = new CameraController(this.el.videoCamera);

        })

        this.el.btnClosePanelCamera.on('click', ev => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();

        })

        this.el.btnTakePicture.on('click', ev => {

            let dataURL = this._camera.takePicture();

            this.el.pictureCamera.src = dataURL;
            this.el.pictureCamera.show();
            this.el.btnReshootPanelCamera.show();
            this.el.containerSendPicture.show();
            this.el.videoCamera.hide();
            this.el.containerTakePicture.hide();

        })

        this.el.btnReshootPanelCamera.on('click', ev => {

            this.el.pictureCamera.hide();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerSendPicture.hide();
            this.el.videoCamera.show();
            this.el.containerTakePicture.show();

        })

        this.el.btnSendPicture.on('click', ev => {

            console.log(this.el.pictureCamera.src)

        })

        this.el.btnAttachDocument.on('click', ev => {

            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({ height: 'calc(100%)' });
            this.el.inputDocument.click();

        })

        this.el.inputDocument.on('change', ev => {

            if (this.el.inputDocument.files.length) {
                this.el.panelDocumentPreview.css({ height: '1%' });

                let file = this.el.inputDocument.files[0];

                this._documentPreview = new DocumentPreviewController(file);

                this._documentPreview.getPreviewData().then((data) => {

                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.infoPanelDocumentPreview.text(data.info);
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({ height: '100%' });

                }).catch(err => {
                    this.el.panelDocumentPreview.css({ height: '100%' });

                    switch (file.type) {

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;

                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;

                    }

                    this.el.filenamePanelDocumentPreview.text(file.name);
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();

                })

            }

        })

        this.el.btnClosePanelDocumentPreview.on('click', ev => {

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show()

        })

        this.el.btnSendDocument.on('click', ev => {

            console.log('send document');

        })

        this.el.btnAttachContact.on('click', ev => {

            this.el.modalContacts.show();

        })

        this.el.btnCloseModalContacts.on('click', ev => {

            this.el.modalContacts.hide();

        })

        this.el.btnSendMicrophone.on('click', ev => {

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();
            this.startRecordMicrophoneTime();

        })

        this.el.btnCancelMicrophone.on('click', ev => {

            this.closeRecordMicrophone();

        })

        this.el.btnFinishMicrophone.on('click', ev => {

            this.closeRecordMicrophone();

        })

        this.el.inputText.on('keypress', ev => {

            if (ev.key === 'Enter' && !ev.ctrlKey) {

                ev.preventDefault();
                this.el.btnSend.click();

            }

        })

        this.el.inputText.on('keyup', ({ target }) => {

            if (target.innerHTML.length) {

                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            } else {

                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();

            }

        })

        this.el.btnSend.on('click', ev => {

            console.log(this.el.inputText.innerHTML);

        })

        this.el.btnEmojis.on('click', ev => {

            this.el.panelEmojis.toggleClass('open');

        })

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

            emoji.on('click', ev => {

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name => {
                    img.addClass(name);
                })

                let cursor = window.getSelection();

                if (!cursor.focusNode || !cursor.focusNode.id === "input-text") {

                    this.el.inputText.focus();
                    cursor = window.getSelection();

                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img)

                range.insertNode(frag);
                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            })

        })


    }

    startRecordMicrophoneTime() {

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);

        }, 100);

    }

    closeRecordMicrophone() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
        this.el.recordMicrophoneTimer.innerHTML = "";
        clearInterval(this._recordMicrophoneInterval);

    }

    closeAllMainPanel() {

        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');


    }

    closeMenuAttach(ev) {

        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');

    }

    closeAllLeftPanel() {

        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();

    }
}