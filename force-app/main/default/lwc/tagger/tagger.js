/**
 * Created by jgontarek on 20.12.2023.
 */

import {api, LightningElement, track, wire} from 'lwc';

import TAG_FIELD from '@salesforce/schema/Doctor__c.Tags__c';

import saveTags from '@salesforce/apex/TagController.saveTags';
import {getRecord} from "lightning/uiRecordApi";

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
            {label: 'Red', value: 'slds-badge slds-theme_error'},
            {label: 'Green', value: 'slds-badge slds-theme_success'}
        ]
    }

    handleTagNameChange(event) {
        this.tagName = event.target.value;
        console.log(event.target.value);
    }

    handleTagColorChange(event) {
        this.tagColor = event.detail.value;
        console.log(event.detail.value);
    }

    handleAddTag() {
        let tagId = this.tagName + '_' + this.tagColor;
        let tag = {
            id: tagId,
            name: this.tagName,
            color: this.tagColor
        }

        this.tags.push(tag);
        console.log(JSON.stringify(this.tags));
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
        let id = event.target.tagId;
        console.log(id);

        this.tags = this.tags.filter((tag) => tag.id !== id);
    }
}