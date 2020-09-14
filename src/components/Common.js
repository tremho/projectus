
import {SimpleDateFormat} from '../general/SimpleDateFormat'

export function getApp() {
  const rootComp = getComponent(document.body.querySelector('[is="app"]'))
  const app = rootComp.props.app;
  return app;
}
export function getComponent(el) {
  let syms;
  do {
    syms = Object.getOwnPropertySymbols(el)
    if(syms.length === 0) {
      el = el.parentElement
    }
  } while(syms.length === 0)

  const comp = el[syms[0]]
  return comp
}


class Common {
  constructor(riotRoot)
  {
    this.riot = riotRoot;
    this.fits = []
    this.fitNum = 0;
  }
  /** picks the next parsed fit value, or the last one if list was exhausted */
  nextFit()
  {
    return this.fits[this.fitNum++] || this.fits[this.fits.length - 1]
  }
  /**
   * return the instance of the Presentation class that has been exposed as a property in the app root
   * @returns {Presentation}
   */
  getApp()
  {
    const boundTag = document.body.querySelector('[is="app"]')
    if(!boundTag) {
      throw Error('riot app not bound to page')
    }
    const rootComp = this.getComponent(boundTag)
    const app = rootComp.props.app;
    return app;
  }

  /**
   * gets the Riot Component instance that the given DOM element belongs to
   *
   * @param el
   * @returns {riot-component} Riot component
   */
  getComponent(el)
  {
    if(!el) return null;
    let syms;
    do {
      syms = Object.getOwnPropertySymbols(el)
      if (syms.length === 0) {
        el = el.parentElement
      }
    } while (syms.length === 0)

    const comp = el[syms[0]]
    return comp
  }

  /**
   * return the DOM element of the <div> container that all of our Riot components consist of
   * as their container.
   * @param {riot-component} [riot] // if not passed, uses the one that created this class
   * @returns {Element}
   */
  getContainer(riot)
  {
    if(!riot) riot = this.riot;
    return riot.root.firstElementChild
  }
  /**
   * parses the *'fit' property* into width/height sizes and applies them
   * (the *'orientation' property* (horizontal/vertical) determines whether the values are applied to children width
   * or height.
   *
   * `fit` is a series of expressions (separated by spaces) describing the sizing to apply to
   * the children, in order.  If there are more children than expressions, the last expression used is used for all
   * subsequent children.
   * Format is <n><unit> where <n> is number and <unit> is the CSS unit to apply.
   * example expressions:  100px  30%  12em
   *
   *
   * #### Special unit values:
   *
   * - "*" == one fractional amount (number of children divided evenly)
   * - "**" == use natural size of child element (equivalent to "100%")
   *
   * example: `"* 2* 3* *"` in a 5 item list
   *
   * would translate to the equivalent of (20% 40% 60% 20% 20%) among the 5 items (although computed px values rather
   * than % notation is applied)
   *
   * @param {string} props
   */
  parseFits(props)
  {
    if(!props || !props.fit) return;
    let keepGoing = true;

    const app = this.getApp()
    const sp = app.makeStringParser(props.fit)

    while (keepGoing) {
      try {
        const exp = sp.readNext()
        let unit, val;
        if (exp.substring(exp.length - 2) === "()") {
          // a function callback named
          this.fits.push(exp)
        } else {
          if (exp === '*' || exp === '**') {
            unit = exp;
            val = 1;
          } else {
            const re = /[\d\.]+/
            const match = re.exec(exp)[0]
            unit = exp.substring(match.length)
            val = Number.parseFloat(match)
          }
          let numKids = this.getContainer().children.length;
          let cdim = this.getContainer().getBoundingClientRect()
          const fullSize = props.orientation === 'horizontal' ? cdim.width : cdim.height;
          let even = fullSize / numKids;
          let size;
          if (unit === '**') {
            size = 100
            unit = "%";
          } else if (unit === '*') {
            size = val * even
            unit = 'px'
          } else {
            size = val;
          }
          this.fits.push(`${size}${unit}`)
        }
        keepGoing = sp.getRemaining().length > 0
      } catch (e) {
        console.error(e);
        keepGoing = false;
      }
    }
    // console.log('fits', this.fits)
    this.applyFits(props.orientation === 'horizontal')
  }
  /**
   * Applies the sizes parsed in 'fits' to the container children
   * @param {boolean} isHorizontal
   */
  applyFits(isHorizontal)
  {
    const children = this.getContainer().children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.style.display = isHorizontal ? 'inline-block' : 'inline'
      child.style.verticalAlign = 'top'
      const innerChild = child.firstElementChild
      const fitSize = this.nextFit()
      if (isHorizontal) {
        innerChild.style.width = fitSize;
      } else innerChild.style.height = fitSize;
    }
  }

  setCommonProps(el, props, defaults) {
    if(!defaults) defaults = {
      width: '100%',
      height: '100%'
    }
    el.style.width = props.width || defaults.width;
    el.style.height = props.height || defaults.height;
    el.style.background = props.background || defaults.background;
    el.style.backgroundColor = props.backgroundColor || defaults.backgroundColor;
  }

  applyContainerStyles(div, styleText) {
    if(!div || !div.style || !styleText) return;
    const statements = styleText.split(';')
    statements.forEach(statement => {
      const kv = statement.split(':')
      let key = kv[0].trim().toLowerCase()
      const value = kv[1].trim().toLowerCase()
      const kcp = key.split('-')
      key = kcp[0]+kcp[1].charAt(0).toUpperCase()+kcp[1].substring(1)
      div.style[key] = value
    })
  }

  bindComponent() {
    const component = this.riot
    if(!component.bound) component.bound = {}
    function doBind(bind) {
      if(bind) {
        const [section, name] = bind.split('.')
        model.bind(section, name, (prop, value, old) => {
          const upd = component.bound
          let doUpdate = upd[prop] !== old || upd[prop] !== value
          upd[prop] = value
          if (doUpdate) {
            component.bound = upd;
            component.update()
          }
        })
        component.bound[name] = model.getAtPath(bind)
      }
    }
    const div = this.getContainer() // component.$('DIV')
    const app = this.getApp()
    const model = app.model
    // doBind(component.getAttribute('bind'))
    doBind(div.getAttribute('bind'))
    for (let i = 0; i < div.children.length; i++) {
      const child = div.children[i]
      doBind(child.getAttribute('bind'))
    }
    component.update()
  }

  formatDate(dtIn, format) {
    let db = true
    let sdf = new SimpleDateFormat(dtIn)
    if(format) sdf.setFormat(format)
    console.log('do your debugging here')
    let rt = "foobar"
    if(db) {
      rt = sdf.toString()
    }
    return rt
  }
}

export function newCommon(riot) {
  return new Common(riot)
}
