/**
 * Created by Delneg on 27.11.16.
 */
var RemoteStorage = function() {
  function set(key, val,callback) {

      $.post("/scrum_set", {"key": key, "val": val})
          .done(function (data) {
              callback(data,null);
          })
          .fail(function (error) {
              callback(null,error);
          })
  }

  function get(key) {
    return localStorage.getItem(key);
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  return {
    set: set,
    get: get,
    remove: remove
  }
}();
