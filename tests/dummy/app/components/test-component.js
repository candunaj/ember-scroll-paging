import Component from '@ember/component';
import EmberObject from '@ember/object';
import layout from 'dummy/templates/components/test-component';
import { later } from '@ember/runloop';
import { Promise } from 'rsvp';

export default Component.extend({
    layout,
    needRefresh: false,
    actions: {
        refresh(){
            this.set('needRefresh', true);
        },

        loadPage(pageIndex, pageSize){
            console.log('load page: '+pageIndex);
            let requestTime = new Date().getTime();
            let loadPromise = new Promise(resolve=>{
                    let result = [];
                    let count = (pageIndex===10 ? 3 : pageSize);
                    for(let i=0;i<count; i++){
                        result.push(EmberObject.create({
                            name: 'testName '+ requestTime + ' ' + (i+(pageIndex*pageSize))
                        }));
                    }

                    result.count = pageSize*10+3;
                setTimeout(()=>{
                    resolve(result);
                }, 5000);
            });

            return loadPromise;
        }
    }
});
