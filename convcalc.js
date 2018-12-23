/******************************************************************************\

                    Copyright 2018. Cauldron Development LLC
                              All Rights Reserved.

                  For information regarding this software email:
                                 Joseph Coffland
                          joseph@cauldrondevelopment.com

        This software is free software: you clan redistribute it and/or
        modify it under the terms of the GNU Lesser General Public License
        as published by the Free Software Foundation, either version 3 of
        the License, or (at your option) any later version.

        This software is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
        Lesser General Public License for more details.

        You should have received a copy of the GNU Lesser General Public
        License along with the software.  If not, see
        <http://www.gnu.org/licenses/>.

\******************************************************************************/

'use strict'

/*
  Usage:

      <div id="calc"></div>

      new ConvCalc({id: 'calc', init: 1, precision: 3, units: [
        {label: 'mm', scale: 1,         title: 'Millimeters'},
        {label: 'm',  scale: 1000,      title: 'Meters'},
        {label: 'in', scale: 25.4,      title: 'Inches'},
        {label: 'ft', scale: 12 * 25.4, title: 'Feet'},
      ]})
*/


function ConvCalc(config) {
  var updaters = [];
  var precision = typeof config.precision == 'undefined' ? 2 : config.precision;


  function updateAll(except, value) {
    for (var i = 0; i < updaters.length; i++)
      if (i != except) updaters[i](value);
  }


  function createUnit(unit) {
    var unit_precision =
        typeof unit.precision == 'undefined' ? precision : unit.precision;

    var div = document.createElement('div');
    div.setAttribute('class', 'convcalc-item');
    div.setAttribute('title', unit.title);

    var input = document.createElement('input');
    var id = updaters.length;

    function changed() {updateAll(id, input.value * unit.scale)}


    function update(value) {
      input.value = (value / unit.scale).toFixed(unit_precision)
    }

    input.setAttribute('type', 'number');
    input.setAttribute('step', Math.pow(10, -precision));
    input.addEventListener('input', changed);
    input.addEventListener('change', changed);
    div.appendChild(input);
    updaters.push(update);

    var label = document.createElement('label');
    label.innerText = unit.label;
    div.appendChild(label);

    return div;
  }

  var target = document.getElementById(config.id);
  target.setAttribute('class', 'convcalc');

  for (var i = 0; i < config.units.length; i++)
    target.appendChild(createUnit(config.units[i]));

  if (typeof config.caption != 'undefined') {
    var caption = document.createElement('caption');
    caption.innerHTML = config.caption;
    target.appendChild(caption);
  }

  if (typeof config.init != 'undefined') updateAll(undefined, config.init);
};
