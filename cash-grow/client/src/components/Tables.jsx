
function Tables() {
    return(
        <table>
            <td>
                {tableCreator()}
            </td>
        </table>
    )
}

function tableCreator(){
    const values = [];
    for(let i = 0; i < 50; i += 3){
        values.push(<tr><td>{i}</td>, <td>{i+1}</td>, <td>{i+2}</td></tr>)
    }
    return(values)
}

export default Tables;