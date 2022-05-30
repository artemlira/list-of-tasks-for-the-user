'use strict';

class Tasks {
   constructor({ wrapper, tasksContent, comletedTasks, tasks, }) {
      this.wrapper = document.querySelector(wrapper);
      this.tasksContent = this.wrapper.querySelector(tasksContent);
      this.comletedTasks = this.wrapper.querySelector(comletedTasks);
      this.tasks = document.querySelector(tasks);
      this.objectAllTasks = null;
   }

   getlocalStorage() {
      const request = new XMLHttpRequest();
      request.addEventListener('readystatechange', () => {
         if (request.readyState === 4 && request.status === 200) {
            this.objectAllTasks = JSON.parse(request.responseText);
            this.objectAllTasks.forEach(item => {
               if (item.userId === 1) {
                  this.createAllWrap(item);
               }
            });
         }
      });
      request.open('GET', 'https://jsonplaceholder.typicode.com/todos');
      request.setRequestHeader('Content-type', 'application/json');
      request.send();

   }

   // setLocalStorage() {
   //    localStorage.setItem('tasks', JSON.stringify(this.objectAllTasks));
   // }

   addTask() {
      this.tasksContent.append(this.tasks.cloneNode(true));
   }

   createWrapInProgress(elem) {
      let copy = this.tasks.cloneNode(true);
      copy.querySelector('input').value = elem;
      this.tasksContent.append(copy);
   }

   createWrapInComleted(elem) {
      let copy = this.tasks.cloneNode(true);
      copy.querySelector('input').value = elem;
      copy.querySelector('.tasks__content__finish').classList.add('fa-circle-check');
      copy.querySelector('.tasks__content__add').classList.add('fa-circle-minus');
      copy.querySelector('.tasks__content__add').classList.remove('fa-circle-plus');
      copy.querySelector('input').setAttribute('readonly', 'readonly');
      this.comletedTasks.append(copy);
   }

   createAllWrap(object) {
      let title = object.title;
      let completed = object.completed;
      if (completed == false) {
         this.createWrapInProgress(title);
      } else {
         this.createWrapInComleted(title);
      }
   }

   click(even) {
      let target = even.target;
      let parent = target.closest('.task');
      if (target.matches('.tasks__content__finish')) {
         this.transferTasks(parent);
      }
      if (target.matches('.fa-circle-plus')) {
         this.addTask();
      }
      if (target.matches('.fa-circle-minus')) {
         this.removeElement(parent);
      }

      this.firstTask();
      this.updateAllTasks();
      // this.setLocalStorage();
   }

   input(even) {
      let target = even.target;
      if (target.localName == 'input') {
         this.updateAllTasks();
         // this.setLocalStorage();
      }
   }

   transferTasks(elem) {
      if (elem.querySelector('input').value) {
         elem.querySelector('.tasks__content__finish').classList.add('fa-circle-check');
         elem.querySelector('.fa-circle-plus').classList.add('fa-circle-minus');
         elem.querySelector('.fa-circle-plus').classList.remove('fa-circle-plus');
         elem.querySelector('input').setAttribute('readonly', 'readonly');
         this.comletedTasks.append(elem);
      }
   }

   removeElement(elem) {
      elem.remove();
   }

   clearAllTasks() {
      this.tasksContent.innerHTML = '';
      this.comletedTasks.innerHTML = '';
   }


   firstTask() {
      if (this.tasksContent.querySelectorAll('.task').length == 0) {
         this.addTask();
      }
   }

   updateAllTasks() {
      this.objectAllTasks = {};
      let allInput = this.wrapper.querySelectorAll('input');
      allInput.forEach((elem, index) => {
         this.objectAllTasks[index] = {};
         this.objectAllTasks[index].text = elem.value;
         let status = true;
         if (elem.closest('.tasks__content')) {
            status = false
         }
         this.objectAllTasks[index].status = status;
      });
   }


   init() {
      this.clearAllTasks();
      this.getlocalStorage();
      this.wrapper.addEventListener('click', this.click.bind(this));
      this.wrapper.addEventListener('input', this.input.bind(this));
   }
}
