function Actions() {

    return (
        <div id='actions'>
            <h2>Actions</h2>
            <menu>
                <li><button id='submit'>Submit</button>$<span id='curCall'>0</span></li>
                <li><input type='range'/></li>
                <li><button>Fold</button></li>
                <li><button>Skip</button></li>
            </menu>
        </div>
    )
}

export default Actions