import { HeaderContainer } from "./styles";

import LogoIgnite from '../../assets/logo-ignite.svg'
import { Scroll, Timer } from "phosphor-react";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <HeaderContainer>
      <span><img src={LogoIgnite} alt="Logo Ignite, simbolizados por dois triangulos verdes, rotacionados 45 graus sentido horario, um levemente sobreposto ao outro na diagonal," /></span>
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Historico">
          <Scroll size={24} />

        </NavLink>
      </nav>
    </HeaderContainer>
  )
}