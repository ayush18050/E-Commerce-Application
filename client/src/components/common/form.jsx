import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";



function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) {
    function renderInputsByComponentType(getControlItem) {
        let element = null;
        const value = formData[getControlItem.name] || '';
        switch (getControlItem.componentType) {
            case 'input':
                element = <Input type={getControlItem.type} name={getControlItem.name} id={getControlItem.name} placeholder={getControlItem.placeholder} value={value}
                onChange={(event) => setFormData({ ...formData, [getControlItem.name]: event.target.value })} />
                break;

            case 'select':
                element = <Select value={value} onValueChange={(value) => setFormData({ ...formData, [getControlItem.name]: value })}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={getControlItem.label} />
                    </SelectTrigger>
                    <SelectContent>{getControlItem.options && getControlItem.options.length >0 ? getControlItem.options.map((option) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>) : null}</SelectContent>
                </Select>
                break;

            case 'textarea':
                element = <Textarea name={getControlItem.name} id={getControlItem.id} placeholder={getControlItem.placeholder} value={value}
                onChange={(event) => setFormData({ ...formData, [getControlItem.name]: event.target.value })} />
                break;
            
            default:
                element = <Input type={getControlItem.type} name={getControlItem.name} id={getControlItem.name} placeholder={getControlItem.placeholder} value={value} 
                onChange={(event) => setFormData({ ...formData, [getControlItem.name]: event.target.value })} />
                break
            
        }
        return element;
    }
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3">
                {formControls.map((controlItem) => <div className="grid w-full gap-1.5" key={controlItem.name}>
                    <Label className="mb-1">{controlItem.Label}</Label>
                    {
                        renderInputsByComponentType(controlItem)
                    }
                </div> )}
            </div>
            <Button  type="submit" className="mt-2 w-full" disabled={isBtnDisabled}>
                {buttonText || "Submit"}
            </Button>
        </form>
    )
}

export default CommonForm;