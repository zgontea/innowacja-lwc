/**
 * Created by jgontarek on 20.12.2023.
 */

import {api, LightningElement} from 'lwc';

export default class Tag extends LightningElement {
    @api tagId;
    @api name;
    @api color;

    handleRemoveTag(event) {
        this.dispatchEvent(new CustomEvent('removetag'));
    }
}