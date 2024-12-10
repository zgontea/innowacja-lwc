/**
 * Created by jgontarek on 20.12.2023.
 */

import {api, LightningElement, track, wire} from 'lwc';
import { getRecord } from "lightning/uiRecordApi";

import saveTags from '@salesforce/apex/TagController.saveTags';

import TAG_FIELD from '@salesforce/schema/Doctor__c.Tags__c';

export default class Tagger extends LightningElement {
    @api recordId;

    @track tags = [];
    tagName;
    tagColor;

    @wire(getRecord, {recordId: "$recordId", fields: [TAG_FIELD]})
    getTags({data, error}) {
        if (data) {
            this.tags = JSON.parse(data.fields[TAG_FIELD.fieldApiName].value);
        } else if (error) {
            console.error(JSON.stringify(error));
        }
    }

    get tagColors() {
        return [
            {label: 'Red', value: 'slds-theme_error'},
            {label: 'Green', value: 'slds-theme_success'},
            {label: 'Yellow', value: 'slds-theme_warning'}
        ]
    }

    handleTagNameChange(event) {
        this.tagName = event.target.value;
    }

    handleTagColorChange(event) {
        this.tagColor = event.detail.value;
    }

    handleAddTag() {
        let tag = {
            id: this.tagName + '_' + this.tagColor,
            name: this.tagName,
            color: this.tagColor
        }

        if (this.tags.find(existingTag => existingTag.id === tag.id)) {
            console.error('Tag already exists')
            return;
        }

        this.tags.push(tag);
    }

    handleSaveTags() {
        saveTags({recordId: this.recordId, tags: JSON.stringify(this.tags)})
            .then(() => {
                console.log('Tags Saved!');
            })
            .catch(error => {
                console.error(JSON.stringify(error));
            })
    }

    handleRemoveTag(event) {
        this.tags = this.tags.filter((tag) => tag.id !== event.detail.tagId);
    }
}