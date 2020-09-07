
#### Some tools and templates worth creating to help things along

###1. Component stub generator.
Enter the name of the component (component-name), will generate the following
 file in `components/global/stub/component-name.riot`:
 ```riothtml
<component-name>
<div>
    component-name<
</div>
 <style>
 
</style>
<script>
import * as cm from '../../common'
export default {
    state: {
    },
    onBeforeMount(props, state) {    
    }    
}
</script>
</component-name>
```

all the components are wrapped in a div.  the behavoir of that
div can be styled if needed, but by default the layout behavior
will be to vertical stack in its local container. 

####2. Layout fitting templates.
Layout containers to help arrange within our component panels
 - with slots to hold fitted contents
 - horizontal, vertical, grid, dock, 
 - try to match NS layouts.
 

### `Stack-Layout`
 vertical and horizontal, default is vertical.
 Vertical can just be a div, since all other div-based
 components will stack vertically naturally.
 Horizontal is done 