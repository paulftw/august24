import React, { Component, Text } from 'react'

import { DEBUG, DebugOverlay, debugValue, } from '../debugtools'

export default class Router {
  constructor(rootView, { routes, initialRoute, initialParams }) {
    this.routes = routes || {}
    this.rootView = rootView
    this.navigate(initialRoute, initialParams)
  }

  navigate(route, routeParams) {
    DEBUG && debugValue('route', route)
    if (!this.routes[route]) {
      throw new Error('Unknown route: ' + route)
    }
    const statePatch = {
      route,
      routeParams,
    }
    if (this.rootView.isMounted()) {
      this.rootView.setState(statePatch)
    } else {
      Object.assign(this.rootView.state, statePatch)
    }
  }

  getRoute() {
    return this.rootView.state.route
  }

  render() {
    const {route, routeParams} = this.rootView.state
    const viewFn = this.routes[route]
    // alert(`Route: ${route} viewFn: ${viewFn}`)
    if (!viewFn) {
      return <Text style={{ color: 'red', fontSize: 32, }}>Unknown route name: {route}</Text>
    }
    if (DEBUG) {
      return <DebugOverlay>
        {viewFn(routeParams)}
      </DebugOverlay>
    }
    return viewFn(routeParams)
  }
}
