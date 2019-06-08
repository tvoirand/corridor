/*
Math module for the corridor project.
*/

function normalize(value, data){
    /*
    Return value normalized to 0-1 range based on min and max values in data.
    Input:
        -value  float
        -data   [float, ...]
    Output:
        -       float
    */
    return (value - Math.min(...data)) / (Math.max(...data) - Math.min(...data));
}
