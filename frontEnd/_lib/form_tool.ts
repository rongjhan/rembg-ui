type field_type = "input"|"select"|"radio"|"checkbox"|"switch"
//此處field_type並不一定要選染成對應的DOM , 此處更代表多選,單選,自由輸入等意義
type Payload = {
    value:string|string[]|undefined|boolean,
    options?:string[]
}

interface FormNode{
    parent:FormNode|null;
    prevNext:FormNode|null
    
}
interface FormGroup extends FormNode{
    //member表示那些互不相關的field集合
    //那些與group成員值相關的動態FormNode應由next函數返回,若沒有則為null
    name:string;
    member:()=>FormNode[]|null;
    next:(current:this)=>FormNode|null;
}

export interface FormItem extends FormNode{
    //next返回與此field value相關的FormNode,若沒有則為null
    name:string,
    field_type :field_type;
    payload : Payload;
    next:(current:this)=>FormNode|null;
}



export function createFormItem(
    name:FormItem["name"],
    field_type:FormItem["field_type"],
    payload:FormItem["payload"],
    next?:FormItem["next"],
    parent?:FormItem["parent"],
    prevNext?:FormGroup["prevNext"]
):FormItem
{
    if (!next){
        next =  ()=> null
    }

    return {
        name,
        field_type,
        payload,
        next(){
            let nextItem = next(this)

            if (nextItem){
                //處理 next formnode parent指向
                nextItem.parent = this
            } 

            // if (this.prevNext && this.prevNext!==nextItem){
            //     // 處理之前next 的 parent指向
            //     this.prevNext.parent = null
            // }
            
            // //紀錄當前返回 nextItem為 prevNext
            // this.prevNext = nextItem
            
            return nextItem
        },
        parent:parent??null,
        prevNext:prevNext??null
    }
}


export function createFormGroup(
    name:string,
    member?:FormGroup["member"],
    next?:FormGroup["next"],
    parent?:FormGroup["parent"],
    prevNext?:FormGroup["prevNext"]
):FormGroup
{
    if (!next){
        next =  ()=> null
    }

    if (!member){
        member =  ()=> null
    }

    return {
        name,
        member,
        next(){
            let nextItem = next(this)
            
            if (nextItem){
                //處理 next formnode parent指向
                nextItem.parent = this
            } 

            // if (this.prevNext && this.prevNext!==nextItem){
            //     // 處理之前next 的 parent指向
            //     this.prevNext.parent = null
            // }

            // //紀錄當前返回 nextItem為 prevNext
            // this.prevNext = nextItem
            
            return nextItem
        },
        parent:parent??null,
        prevNext:prevNext??null
    }
}

export function findFieldByName(formNode:FormGroup|FormItem,name:string):FormItem|null{
    let isGrounp = formNode.member

    if(isGrounp){
        for (let m  of formNode.member()){
            if (m.payload && m.name == name) return m
    
            let next = m.next(m)
    
            if(next){
                let nextResult = findFieldByName(next,name)
                if(nextResult){
                    return nextResult
                }else{
                    continue
                }
            }
        }
    }else{
        if (formNode.name == name) return formNode
    }

    let next = formNode.next(formNode)

    if(next){
        return findFieldByName(next,name)
    }

    return null
}


function copyFormNode<T extends FormGroup|FormItem>(formNode:T):T{
    let newNode:typeof formNode = {...formNode}
    newNode.next(newNode)  //讓其子元素parent指向新元素
    return newNode
}


export function setFormItemValue<T extends FormGroup|FormItem>(fromNode:T,formNodeName:string,value:any):T{
    let formItem = findFieldByName(fromNode,formNodeName)
    if (formItem){
        formItem.payload.value = value
        return copyFormNode(fromNode)          
    }
    throw `field ${formNodeName} doesn't exist`
}



