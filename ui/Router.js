import React, { Component, Text } from 'react'

export default class Router {
  constructor(rootView, { routes, initialRoute, initialParams }) {
    this.routes = routes || {}
    this.rootView = rootView
    this.route = initialRoute
    this.routeParams = initialParams
    this.navigate(initialRoute, initialParams)
  }

  navigate(route, routeParams) {
    if (!this.routes[route]) {
      throw new RuntimeError('Unknown route: ' + route)
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

  render() {
    const {route, routeParams} = this.rootView.state
    const viewFn = this.routes[route]
    // alert(`Route: ${route} viewFn: ${viewFn}`)
    if (!viewFn) {
      return <Text style={{ color: 'red', fontSize: 32, }}>Unknown route name: {route}</Text>
    }
    return viewFn(routeParams)
  }
}
