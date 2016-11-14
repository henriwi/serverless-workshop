//export const fetchTodos = () => {
//   return (dispatch) => {
//       console.log("mounted");
//   }
//}

function fetchTodos() {
    return function(dispatch) {
        dispatch({type: "FETCH_TODO" });
        console.log("waddup");
    }
}
