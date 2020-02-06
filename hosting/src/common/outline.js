import React from 'react';
import classnames from 'classnames';

export const SectionContext = React.createContext({ level: 1, });

export const Section = ({ children, component = 'section', ...props }) => (
  <SectionContext.Consumer>{context => {
    const Component = component;

    return (
      <Component {...props}>
        <SectionContext.Provider value={{ level : context.level + 1 }}>{children}</SectionContext.Provider>
      </Component>
    );
  }}</SectionContext.Consumer>
);

export const Heading = ({ ...props
}) => (
  <SectionContext.Consumer>{context => {
    const Component = `h${context.level}`;
    return <Component {...props} />;
  }}</SectionContext.Consumer>
);

export const Group = ({ headline, component = 'div',className, ...props }) => (
  <SectionContext.Consumer>{context => {
    const Component = component;
    return <Component {...props} className={classnames([className, headline ? 'group_1' : `group_${context.level}`])} />;
  }}</SectionContext.Consumer>
);

export const withOutlineLevel = Component => props => (
  <SectionContext.Consumer>{context => <Component {...props} outlineLevel={context.level} />}</SectionContext.Consumer>
);
