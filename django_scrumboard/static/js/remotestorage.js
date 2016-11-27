/**
 * Created by Delneg on 27.11.16.
 */

var RemoteStorage = function() {
    //TODO: add config for urls

    //For getting CSRF token
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });


    function createTask(data,callback) {
        $.ajax({
            url: "/scrumboard/tasks/create/", // the endpoint
            type: "POST", // http method
            data: data,
            success: function (json) {
                callback({"data":json,"error":null});
            },

            error: function (xhr, errmsg, err) {
                var error_msg = xhr.status + ": " + xhr.responseText;
                callback({"data":error_msg,"error":true});
            }
        });
    }
    function getTasks(callback) {
        $.ajax({
            url: "/scrumboard/tasks/", // the endpoint
            type: "GET", // http method
            success: function (json) {
                callback({"data":json,"error":null});
            },

            error: function (xhr, errmsg, err) {
                var error_msg = xhr.status + ": " + xhr.responseText;
                callback({"data":error_msg,"error":true});
            }
        });
    }

    function deleteTask(id,callback) {
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: "/scrumboard/tasks/delete/"+id+"/",
            type: "DELETE",
            data: {"csrfmiddlewaretoken" : csrftoken},
            success: function (json) {
                callback({"data":json,"error":null});
            },
            error: function (xhr, errmsg, err) {
                var error_msg = xhr.status + ": " + xhr.responseText;
                callback({"data":error_msg,"error":true});
            }
        })
    }

    function updateTask(id,data,callback){
        $.ajax({
            url: "/scrumboard/tasks/update/"+id+"/",
            type: "POST",
            data: data,
            success: function (json) {
                callback({"data":json,"error":null});
            },
            error: function (xhr, errmsg, err) {
                var error_msg = xhr.status + ": " + xhr.responseText;
                callback({"data":error_msg,"error":true});
            }
        })
    }

  return {
    createTask: createTask,
    getTasks:getTasks,
    deleteTask: deleteTask,
    updateTask: updateTask
  }
}();
