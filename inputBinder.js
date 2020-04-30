const InputBinder = function (input) {
    let value = 0;
    this.input = input;
    this.onInputChanged = () => {};
    this.validate = (oldValue, newValue) => true;
    this.correct = (oldValue, newValue) => oldValue;
    this.fixedWidth = -1;
    const checkValue = (oldValue, newValue) => {
        return this.validate(oldValue, newValue) ? newValue : this.correct(oldValue, newValue);
    }
    const display = (input, value, padding) =>{
        if (this.fixedWidth > 0){
            input.value = ("0000000000" + value).slice(-padding);
        } else {
            input.value = value;
        }
    }
    Object.defineProperty(this, "value", {
        get: function () {return value;},
        set: function (newValue) {
            value = checkValue(value, newValue);
            if (this.input !== null){
                display(this.input, value, this.fixedWidth);
            }
        }
    });
    if (this.input !== null){
        this.input.addEventListener("change", (e) => {
            const oldValue = value;
            value = parseInt(e.target.value);
            value = checkValue(oldValue, value);
            display(this.input, value, this.fixedWidth);
            this.onInputChanged(oldValue, value);
        });
    }
}

export default InputBinder;