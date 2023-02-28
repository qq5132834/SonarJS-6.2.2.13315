/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2020 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });
import { rule } from '../../src/rules/sonar-no-fallthrough';

ruleTester.run('No fallthrough in switch statement', rule, {
  valid: [
    {
      code: `
        switch (param) {}

        // with not executable clause
        switch(x) {
          case a:
            break;
          case a:
            function f () {}
        }

        // with 0 case clauses
        switch(x) {
          default:
            foo();
        }

        // case with parentheses
        switch(x) {
          case (a):
            break;
          case (b):
            break;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
      function func(){
        while(condition) {
          switch (param) {
            case 0: // OK
            case 1: // OK
              break;
            case 2: // OK
              return;
            case 3: // OK
              throw new Error();
            case 4: // Noncompliant
              doSomething();
            case 5: // OK
              continue;
            default: // OK
              doSomethingElse();
          }
        }
      }`,
      errors: [
        {
          message:
            'End this switch case with an unconditional break, continue, return or throw statement.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 17,
        },
      ],
    },

    {
      code: `
        switch (param) {
          default: // Noncompliant
            doSomething();
          case 0: // OK
            doSomethingElse();
        }`,
      errors: [{ line: 3 }],
    },
    {
      code: `
      function fun() {
        switch (param) {
          case 0: // OK
            doSomething(); break;
          case 1: // OK
            { break; }
          case 2: // Noncompliant
            {  }
          case 3: // Noncompliant
            {  doSomething(); }
          case 4: // OK
            { { return; } }
          case 5: // OK
            ;
            break;
          default: // OK
            doSomethingElse();
        }
      }
      `,
      errors: [{ line: 8 }, { line: 10 }],
    },
    {
      code: `
      function fun(){
        switch (param) {
          case a:
            break;
          case c:
            while(d) { doSomething(); }
            break;
          case g:
            break;
          case h || i:
            break;
          case g2:
            break;
          case j && k:
            break;
          case l ? m : n:
            break;
          case x: // Noncompliant
            if (f) {
              break;
            }
          case y: // OK
            if (condition) {
              return 0;
            } else {
              return 1;
            }
          default:
            doSomething();
        }
      }
      `,
      errors: [{ line: 19 }],
    },
    {
      code: `
        function fun() {
            switch (param) {
              case 0: // Noncompliant
                doSomethingElse();
              case 1:
                break;
              default:
                doSomething();
            }
          }
    `,
      errors: [{ line: 4 }],
    },
    {
      code: `
        function fun() {
          // OK with comment
          switch (x) {
            case 0:
              foo(); // fallthrough
    
            case 2:
              foo();
              // fall-through
    
            case 3:
              foo();
              // one more comment
              // fall through
    
            case 4:
              if (condition) {
                return foo();
              }
              /* falls through */
    
            case 5:
              foo();
              // passthrough because of this and that
    
            case 6:
              foo();
              // nobreak
    
            case 7:
              foo();
              // proceed
    
            case 8:  // Noncompliant
              if (condition) {
                return foo();
              }
            case 9: // some comment
            case 10:
              bar();
          }
        }
      `,
      errors: [{ line: 35 }],
    },
  ],
});
