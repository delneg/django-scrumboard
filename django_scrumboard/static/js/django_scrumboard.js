/**
 * scrum-board
 *
 * @category   scrum-board
 * @author     Vaibhav Mehta <vaibhav@decodingweb.com>
 * @copyright  Copyright (c) 2016 Vaibhav Mehta <https://github.com/i-break-codes>
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    1.0 Beta
 */
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

                        var newCard = template([obj]);
                        $('#dashboard #' + obj.status).append(newCard);
                        draggable();

                        $('.close-modal').trigger('click');

                        //Clear form fields after submit
                        $(this).find('input[type=text], textarea').val('');

                    } else {

                        console.log("Created task id" + a.data.id);
                        obj.id = a.data.id;
                        obj.status = a.data.status;
                        LocalStorage.set('task-' + a.data.id, JSON.stringify(obj));
                        LocalStorage.set('taskCounter', a.data.id);
                        var newCard = template([obj]);
                        $('#dashboard #' + obj.status).append(newCard);
                        draggable();
                        $('.close-modal').trigger('click');

                        //Clear form fields after submit
                        $(this).find('input[type=text], textarea').val('');
                    }
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
            var getTaskData = JSON.parse(LocalStorage.get('task-' + taskId));

            getTaskData[fieldToEdit] = $(this).text();

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
                    RemoteStorage.deleteTask(taskId,function (a) {
                       if (a.error){
                           $('#task-notification').text('Task removal error, deleted task only locally').removeClass('hide');
                       }  else {
                           $('#task-notification').text('Task id '+a.data.id+' removed successfully').removeClass('hide');
                       }
                        setTimeout(function () {
                            $('#task-notification').text('').addClass('hide');
                        }, 3000);
                    });

                } else {
                    //Moves task
                    if (parentId != currentId) {
                        $(elm).detach().removeAttr('style').appendTo(this);
                        RemoteStorage.updateTask(taskId,{"status":currentId},function (a) {
                            if (a.error){
                                $('#task-notification').text('Task move error, moved task only locally').removeClass('hide');
                            } else {
                                $('#task-notification').text('Task id '+taskId+' moved to '+currentId +' successfully').removeClass('hide');
                              //add something like spinner.stopSpinning() here later
                            }
                            setTimeout(function () {
                            $('#task-notification').text('').addClass('hide');
                        }, 3000);
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
