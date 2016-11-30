/**
 * django-scrum-board
 *
 * @category   scrum-board
 * @author     Denis Yakushin <delneg@yandex.ru>
 * @copyright  Copyright (c) 2016 Denis Yakushin <https://github.com/delneg>
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    0.1.1 Alpha
 */
//TODO: fix the bug when description is empty
    //TODO: check the actual errors for the offline status, not server error

var handlebarsTemplate = '{{#each this}}' +
    '<div class="card" data-task-id="{{id}}">' +
    '<a href="#" class="expand-card"></a>' +
    '<h5>{{title}}</h5>' +
    '<div class="card-details">' +
    '<p data-field="description">{{description}}</p>' +
    '<p data-field="url">' +
    '{{#checkIfEmptyRemoteURL url}}{{/checkIfEmptyRemoteURL}}' +
    '</p>' +
    '<p data-field="assigned_to">' +
    '{{#checkIfEmptyAssigned assigned_to}}{{/checkIfEmptyAssigned}}' +
    '</p>' +
    '</div>' +
    '</div>' +
    '{{/each}}';

var App = function () {
    function init() {
        offline();
        tips();
        preset();
        draggable();
        droppable();
        openCard();
        createTask();
        closeModal();
        printNotes();
        editTask();
        exitEditMode();
    }

    function alert(text) {
        $('#task-notification').text(text).removeClass('hide');
        setTimeout(function () {
            $('#task-notification').text('').addClass('hide');
        }, 3000);
    }
    function offline(){
        setInterval(function () {
           if(window.is_offline){
               $("#offline").removeClass('hide');

           } else {
               $("#offline").addClass('hide');
           }
        },500);
    }
    function preset() {
        $('#remove').on('click', function (e) {
            e.preventDefault();
        });

        var defaultTask = {
            id: 1,
            title: 'This is a sample task',
            description: 'Sample tasks are useful to get started',
            url: 'https://asana.com/12345/1234',
            assigned_to: 'Jon Doe',
            status: 'pending'
        }

        if (!LocalStorage.get('appInitialized', true)) {
            LocalStorage.set('taskCounter', 1);
            LocalStorage.set('task-1', JSON.stringify(defaultTask));
            LocalStorage.set('appInitialized', true);
        }
    }

    function createTask() {
        var source = handlebarsTemplate;
        var template = Handlebars.compile(source);

        $('#add-task').on('click', function (e) {
            e.preventDefault();
            $('#add-task-modal').removeClass('hide');

            $('#add-task-modal').find('form').on('submit', function (e) {
                e.preventDefault();

                var obj = {};
                var params = $(this).serialize();
                var splitParams = params.split('&');

                for (var i = 0, l = splitParams.length; i < l; i++) {
                    var keyVal = splitParams[i].split('=');
                    obj[keyVal[0]] = unescape(keyVal[1]);
                }

                RemoteStorage.createTask(params, function (a) {
                    if (a.error) {
                        console.log("error occured", a.data);
                        if (obj.description === '' || obj.title === '') {
                            return;
                        }
                        var iid = LocalStorage.get('taskCounter');
                        obj.id = ++iid;
                        obj.status = 'pending';
                        LocalStorage.set('task-' + obj.id, JSON.stringify(obj));
                        LocalStorage.set('taskCounter', iid);

                    } else {

                        console.log("Created task id" + a.data.id);
                        obj.id = a.data.id;
                        obj.status = a.data.status;
                        LocalStorage.set('task-' + a.data.id, JSON.stringify(obj));
                        LocalStorage.set('taskCounter', a.data.id);
                    }

                    var newCard = template([obj]);
                    $('#dashboard #' + obj.status).append(newCard);
                    draggable();
                    $('.close-modal').trigger('click');

                    //Clear form fields after submit
                    $("#add-task-form").find('input[type=text], textarea').val('');
                });

            });
        });
    }

    function editTask() {
        $(document).on('dblclick', '.card-details p', function (e) {
            e.stopPropagation();
            $(this).attr('contenteditable', 'true').parents('.card').addClass('edit-mode');
        });

        $(document).on('input', '.card p', function () {
            var taskId = $(this).parents('.card').data('task-id');
            var fieldToEdit = $(this).data('field');
            var input = $(this).text();
            var newData = {};
            newData[fieldToEdit]=input;
            RemoteStorage.updateTask(taskId, newData, function (a) {
                if (a.error) {
                    //display offline
                    console.log("Couldn't update task "+taskId);
                } else {
                    //success silently
                    console.log("Updated task "+a.data.title+" field "+fieldToEdit+ " to data "+ input);
                }
            });
            var getTaskData = JSON.parse(LocalStorage.get('task-' + taskId));
            getTaskData[fieldToEdit] = input;
            LocalStorage.set('task-' + taskId, JSON.stringify(getTaskData));

        });
    }

    function exitEditMode() {
        $(document).on('dblclick', function (e) {
            $('.card').removeClass('edit-mode').find('[contenteditable]').removeAttr('contenteditable');
        });
    }

    function closeModal() {
        $('.close-modal').on('click', function () {
            $('.modal').addClass('hide');
        })
    }

    function draggable() {
        $('.card').draggable({
            handle: 'h5',
            revert: true,
            cursor: 'move',
            start: function (event, ui) {

            },
            stop: function (event, ui) {

            }
        });
    }

    function droppable() {
        var droppableConfig = {
            tolerance: 'pointer',
            drop: function (event, ui) {
                var elm = ui.draggable,
                    parentId = elm.parent().attr('id'),
                    currentId = $(this).attr('id'),
                    taskId = elm.data('task-id');

                if ($(this).attr('id') == 'remove') {
                    //Deletes task

                    elm.remove(); // delete the element first, because the task will be deleted anyway - locally or remotely
                    LocalStorage.remove('task-' + taskId); // delete task locally
                    RemoteStorage.deleteTask(taskId, function (a) {
                        if (a.error) {
                            alert('Task removal error, deleted task only locally');
                        } else {
                            alert('Task ' + a.data.title + ' removed successfully');
                        }
                    });

                } else {
                    //Moves task
                    if (parentId != currentId) {
                        $(elm).detach().removeAttr('style').appendTo(this);
                        RemoteStorage.updateTask(taskId, {"status": currentId}, function (a) {
                            if (a.error) {
                                alert('Task move error, moved task only locally');
                            } else {
                                alert('Task ' + a.data.title + ' moved to ' + currentId + ' successfully');
                                //TODO: add something like spinner.stopSpinning() here later
                            }
                        });
                        var getTaskData = JSON.parse(LocalStorage.get('task-' + taskId));
                        getTaskData.status = currentId;
                        LocalStorage.set('task-' + taskId, JSON.stringify(getTaskData));
                    } //else does nothing
                }

                $(this).removeClass('dragged-over');
            },
            over: function (event, ui) {
                $(this).addClass('dragged-over');
            },
            out: function (event, ui) {
                $(this).removeClass('dragged-over');
            }
        };

        $('#dashboard > div, #remove').droppable(droppableConfig);
    }

    function openCard() {
        $(document).on('click', '.expand-card', function (e) {
            $(this).parent().toggleClass('expanded');
            e.preventDefault();
        });
    }

    function getAllNotes(callback) {
        RemoteStorage.getTasks(function (a) {
            var getTasks = [];
            if (a.error) {
                console.log("Tasks error");
                var getAllData = localStorage;
                for (var data in getAllData) {
                    if (data.split('-')[0] == 'task') {
                        getTasks.push(JSON.parse(localStorage[data]));
                    }
                }

                callback(getTasks);
            } else {

                callback(a.data.objects);
            }

        });
    }

    function printNotes() {
        var source = handlebarsTemplate;
        var template = Handlebars.compile(source);

        var status = ['rejected', 'pending', 'development', 'testing', 'production'];
        App.getAllNotes(function (notes) {
            for (var i = 0, l = status.length; i < l; i++) {
                var result = notes.filter(function (obj) {
                    return obj.status == status[i];
                });
                if (result) {
                    var cards = template(result);
                    $('#dashboard #' + status[i]).append(cards);
                    draggable();
                }
            }
        });

    }

    function tips() {
        if (!JSON.parse(LocalStorage.get('showedTip'))) {
            $('#tips').removeClass('hide').addClass('tips');
        }

        $('#tips').on('click', function () {
            $(this).addClass('hide');
            LocalStorage.set('showedTip', true);
        });
    }

    return {
        init: init,
        getAllNotes: getAllNotes
    }
}();

App.init();
